import mongoose from "mongoose";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import ProductBriefly from "../models/ProductBriefly.js";
import User from "../models/User.js";
import { verifyRazorpaySignature } from "../utils/paymentUtils.js";
import razorpay from "../config/razorpay.js";

export const verifyAndCreateOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user_id = req.user.id;
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            addressId,
            items
        } = req.body;

        const isAuthentic = verifyRazorpaySignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (!isAuthentic) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                code: "INVALID_SIGNATURE",
                message: "Payment signature verification failed. Possible tampering detected.",
            });
        }

        const user = await User.findById(user_id);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ code: "USER_NOT_FOUND", message: "User not found" });
        }

        const selectedAddress = user.addresses.id(addressId);
        if (!selectedAddress) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ code: "ADDRESS_NOT_FOUND", message: "Address not found" });
        }

        if (!items || !items.length) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ code: "EMPTY_CART", message: "No items provided" });
        }

        const itemMap = new Map();
        for (const { product_variant_id, qty } of items) {
            itemMap.set(product_variant_id, (itemMap.get(product_variant_id) || 0) + qty);
        }

        const ids = [...itemMap.keys()];
        const products = await ProductBriefly.find({ _id: { $in: ids } }).session(session);
        const productMap = new Map();
        products.forEach(p => productMap.set(p._id.toString(), p));

        let amount = 0;
        const orderItemsData = [];

        for (const [product_variant_id, qty] of itemMap) {
            const product = productMap.get(product_variant_id);
            if (!product || product.qty < qty) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    code: "INSUFFICIENT_STOCK",
                    message: `Insufficient stock for SKU ${product?.sku || product_variant_id}`
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
                    message: `Stock update failed for SKU ${item.sku}`
                });
            }
        }

        const [order] = await Order.create(
            [{
                user_id,
                amt: amount,
                status: "Placed",
                paymentMethod: "ONLINE",
                paymentStatus: "Paid",
                paymentDetails: {
                    razorpay_order_id,
                    razorpay_payment_id,
                },
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
            }],
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
            message: "Payment verified and order placed successfully",
            order,
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Payment Verification Error:", error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong during payment verification",
        });
    }
};


export const createOrder = async (req, res) => {
    try {
        const options = {
            amount: req.body.amount * 100,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        };
        const order = await razorpay.orders.create(options);
        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getRazorpayKey = async (req,res) => {
    res.status(200).json({
            key:process.env.RAZORPAY_KEY_ID
        })
} 