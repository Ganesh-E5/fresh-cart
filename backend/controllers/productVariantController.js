import { param } from "express-validator";
import ProductBriefly from "../models/ProductBriefly.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

export const createProductVariantController = async (req, res) => {
    try {
        const {
            product_id,
            img_url,
            size,
            unit,
            sku,
            mrp,
            sp,
            qty,
            rating,
        } = req.body;

        const productFields = {
            product_id,
            img_url,
            sku,
            unit,
            mrp,
            sp,
            qty,
            rating,
        };

        if (size) productFields.size = size;
        if (unit) productFields.unit = unit;

        const product = await ProductBriefly.findOne({ product_id, sku });
        if (product) {
            return res.status(400).json({
                code: "PRODUCT_EXISTS",
                message: "Product already exists",
            })
        }

        const newProduct = await ProductBriefly.create(productFields);

        return res.status(201).json({
            code: "VARIANT_CREATED",
            message: "Product variant created successfully",
            product: newProduct,
        })

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                code: "SKU_EXISTS",
                message: "This SKU already exists for this product",
            });
        }
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        });
    }
}

export const getAllProductsVariantController = async (req, res) => {
    try {
        let {
            page = 1,
            limit = 20,
            category_id,
            brand,
            search,
            sortBy = "createdAt",
            order = 'desc'
        } = req.query;

        page = Number(page)
        limit = Number(limit)

        const productFilter = {};

        if (category_id) productFilter.category_id = category_id;
        if (brand) {
            productFilter.brand = {
                $regex: brand,
                $options: "i"
            }
        }
        if (search) {
            productFilter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    key_words: {
                        $regex: search,
                        $options: "i",
                    }
                }
            ];
        }

        if (category_id) {
            const category = await Category.findById(category_id);
            if (!category) {
                return res.status(404).json({
                    code: "CATEGORY_NOT_FOUND",
                    message: "Category not found"
                })
            }
        }

        const products = await Product.find(productFilter).select("_id");

        const productIds = products.map(product => product._id);

        const variantFilter = {
            product_id: {
                $in: productIds
            }
        }

        const variants = await ProductBriefly.find(variantFilter)
            .populate({
                path: "product_id",
                select: "name description brand category_id",
                populate: {
                    path: "category_id",
                    select: "name"
                }
            })
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))

        const totalDocuments = await ProductBriefly.countDocuments(variantFilter);
        return res.status(200).json({
            code: "VARIANTS_FETCHED",
            message: "Product variants fetched successfully",
            products: variants,
            pagination: {
                page,
                limit,
                totalDocuments,
                totalPages: Math.ceil(totalDocuments / limit),
            }
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        });
    }
}

export const getProductVariantByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductBriefly.findById(id);
        if (!product) {
            return res.status(404).json({
                code: "PRODUCT_NOT_FOUND",
                message: "Product not found"
            })
        }
        return res.status(200).json({
            code: "VARIANT_FOUND",
            message: "Product variant fetched successfully",
            product
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        });
    }
}

export const updateProductVariantController = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            product_id,
            img_url,
            size,
            unit,
            sku,
            mrp,
            sp,
            qty,
            rating
        } = req.body;

        const updatedFields = {};

        if (product_id) updatedFields.product_id = product_id;
        if (img_url) updatedFields.img_url = img_url;
        if (size) updatedFields.size = size;
        if (unit) updatedFields.unit = unit;
        if (sku) updatedFields.sku = sku;
        if (mrp) updatedFields.mrp = mrp;
        if (sp) updatedFields.sp = sp;
        if (qty) updatedFields.qty = qty;
        if (rating) updatedFields.rating = rating;

        const product = await ProductBriefly.findByIdAndUpdate(
            id,
            { $set: updatedFields },
            { new: true, runValidators: true },
        );

        if (!product) {
            return res.status(404).json({
                code: "VARIANT_NOT_FOUND",
                message: "Product variant not found"
            })
        }

        return res.status(200).json({
            code: "VARIANT_UPDATED",
            message: "Product variant updated successfully",
            product
        })

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                code: "SKU_EXISTS",
                message: "This SKU already exists for this product",
            });
        }
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        });
    }
}

export const deleteProductVariantController = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductBriefly.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({
                code: "VARIANT_NOT_FOUND",
                message: "Product variant not found"
            })
        }
        return res.status(200).json({
            code: "VARIANT_DELETED",
            message: "Product variant deleted successfully"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        });
    }
}