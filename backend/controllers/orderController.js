import mongoose from "mongoose";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import ProductBriefly from "../models/ProductBriefly.js";
import User from "../models/User.js";

export const checkOutController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user_id = req.user.id;
        const { items, paymentMethod = "COD", addressId } = req.body;

        const user = await User.findById(user_id);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                code: "USER_NOT_FOUND",
                message: "User account not found",
            });
        }

        const selectedAddress = user.addresses.id(addressId);
        if (!selectedAddress) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                code: "ADDRESS_NOT_FOUND",
                message: "Selected shipping address not found",
            });
        }

        if (!items || !items.length) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                code: "EMPTY_CART",
                message: "No items provided for checkout",
            });
        }

        const itemMap = new Map();
        for (const { product_variant_id, qty } of items) {
            itemMap.set(
                product_variant_id,
                (itemMap.get(product_variant_id) || 0) + qty
            );
        }

        const ids = [...itemMap.keys()];
        const products = await ProductBriefly.find({ _id: { $in: ids } }).session(session);

        const productMap = new Map();
        for (const product of products) {
            productMap.set(product._id.toString(), product);
        }

        let amount = 0;
        const orderItemsData = [];

        for (const [product_variant_id, qty] of itemMap) {
            const product = productMap.get(product_variant_id);

            if (!product) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({
                    code: "PRODUCT_NOT_FOUND",
                    message: "Product not found in inventory",
                    product_variant_id,
                });
            }

            if (!product.product_id) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    code: "PRODUCT_REFERENCE_MISSING",
                    message: "Product variant reference missing",
                    product_variant_id,
                });
            }

            if (product.qty < qty) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    code: "INSUFFICIENT_STOCK",
                    message: `Insufficient stock for SKU ${product.sku}`,
                    product_variant_id,
                });
            }

            amount += product.sp * qty;

            orderItemsData.push({
                product_variant_id,
                qty,
                price: product.sp,
                sku: product.sku,
            });
        }

        for (const item of orderItemsData) {
            const updatedVariant = await ProductBriefly.findOneAndUpdate(
                { _id: item.product_variant_id, qty: { $gte: item.qty } },
                { $inc: { qty: -item.qty } },
                { new: true, session }
            );

            if (!updatedVariant) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    code: "INSUFFICIENT_STOCK",
                    message: `Insufficient stock for SKU ${item.sku}`,
                    product_variant_id: item.product_variant_id,
                });
            }
        }

        const orderStatus = paymentMethod === "COD" ? "Placed" : "Pending_Payment";

        const [order] = await Order.create(
            [
                {
                    user_id,
                    amt: amount,
                    status: orderStatus,
                    paymentMethod,
                    paymentStatus: paymentMethod === "COD" ? "Pending" : "Unpaid",
                    shippingAddress: {
                        name: selectedAddress.name,
                        phone: selectedAddress.phone,
                        houseNo: selectedAddress.houseNo,
                        street: selectedAddress.street,
                        landmark: selectedAddress.landmark,
                        city: selectedAddress.city,
                        state: selectedAddress.state,
                        pincode: selectedAddress.pincode,
                        country: selectedAddress.country,
                    },
                },
            ],
            { session }
        );

        const orderItemsPayload = orderItemsData.map((item) => ({
            order_id: order._id,
            product_variant_id: item.product_variant_id,
            sku: item.sku,
            qty: item.qty,
            price: item.price,
        }));

        await OrderItem.insertMany(orderItemsPayload, { session });

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            code: "ORDER_PLACED",
            message: "Order placed successfully",
            order,
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Checkout Error:", error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong during checkout",
        });
    }
};

export const getAllOrdersController = async (req, res) => {
    try {
        const user_id = req.user.id;

        let {
            page = 1,
            limit = 20,
            sortBy = "createdAt",
            order = "desc",
            status,
        } = req.query;

        page = Number(page);
        limit = Number(limit);

        const ALLOWED_SORT_FIELDS = ["createdAt", "amt", "status"];
        const validSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : "createdAt";

        const filters = { user_id };
        if (status) filters.status = status;

        const skip = (page - 1) * limit;

        const orders = await Order.find(filters)
            .skip(skip)
            .sort({ [validSortBy]: order === "desc" ? -1 : 1 })
            .limit(limit);

        const totalOrders = await Order.countDocuments(filters);

        return res.status(200).json({
            code: "ORDERS_FETCHED",
            message: "Orders fetched successfully",
            orders,
            pagination: {
                page,
                limit,
                totalOrders,
                totalPages: Math.ceil(totalOrders / limit),
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        });
    }
};

export const getAllOrdersAdminController = async (req, res) => {
    try {
        let {
            page = 1,
            limit = 20,
            sortBy = "createdAt",
            order = "desc",
            status,
            user_id,
        } = req.query;

        page = Number(page);
        limit = Number(limit);

        const ALLOWED_SORT_FIELDS = ["createdAt", "amt", "status"];
        const validSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : "createdAt";

        const filters = {};
        if (status) filters.status = status;
        if (user_id) filters.user_id = user_id;

        const skip = (page - 1) * limit;

        const orders = await Order.find(filters)
            .populate("user_id", "username email")
            .skip(skip)
            .sort({ [validSortBy]: order === "desc" ? -1 : 1 })
            .limit(limit);

        const totalOrders = await Order.countDocuments(filters);

        return res.status(200).json({
            code: "ORDERS_FETCHED",
            message: "Orders fetched successfully",
            orders,
            pagination: {
                page,
                limit,
                totalOrders,
                totalPages: Math.ceil(totalOrders / limit),
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        });
    }
};

export const getOrderByIdController = async (req, res) => {
    try {
        const { id } = req.params;

        const filter = req.user.role === "admin" ? { _id: id } : { _id: id, user_id: req.user.id };

        const order = await Order.findOne(filter);

        if (!order) {
            return res.status(404).json({
                code: "ORDER_NOT_FOUND",
                message: "Order does not exist",
            });
        }

        const orderDetails = await OrderItem.find({ order_id: id }).populate({
            path: "product_variant_id",
            populate: {
                path: "product_id",
            },
        });

        return res.status(200).json({
            code: "ORDER_FETCHED",
            message: "Order fetched successfully",
            order,
            orderDetails,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        });
    }
};

export const updateOrderStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const orderToUpdate = await Order.findById(id);

        if (!orderToUpdate) {
            return res.status(404).json({
                code: "ORDER_NOT_FOUND",
                message: "Order does not exist",
            });
        }

        const updateFields = { status };

        if (status === "Delivered" && orderToUpdate.paymentMethod === "COD" && orderToUpdate.paymentStatus === "Pending") {
            updateFields.paymentStatus = "Paid";
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            code: "ORDER_UPDATED",
            message: "Order status updated successfully",
            order,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        });
    }
};