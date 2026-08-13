import Product from "../models/Product.js";
import Category from "../models/Category.js";
import ProductBriefly from "../models/ProductBriefly.js";

export const createProductController = async (req, res) => {
    try {
        const {
            name,
            description,
            category_id,
            brand,
            key_words
        } = req.body;

        const productData = {
            name,
            description,
            category_id,
        };

        const category = await Category.findById(category_id);

        if (!category) {
            return res.status(404).json({
                code: "CATEGORY_NOT_FOUND",
                message: "Category not found",
            });
        }

        if (brand) productData.brand = brand;
        if (key_words?.length) productData.key_words = key_words;

        const product = await Product.create(productData);
        await product.populate("category_id", "name");


        return res.status(201).json({
            code: "PRODUCT_CREATED",
            message: "Product is created successfully",
            product,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        });
    }
}

export const getAllProductsController = async (req, res) => {
    try {
        let {
            page = 1,
            limit = 20,
            category_id,
            brand,
            search,
            sortBy = "createdAt",
            order = "desc"
        } = req.query;

        page = Number(page);
        limit = Number(limit);

        const filter = {};

        if (category_id) filter.category_id = category_id;
        if (brand) {
            filter.brand = {
                $regex: brand,
                $options: "i"
            };
        }
        if (search) {
            filter.name = {
                $regex: search,
                $options: "i"
            };
        }

        const skip = (page - 1) * limit;

        const products = await Product.find(filter)
            .populate("category_id", "name")
            .skip(skip)
            .limit(limit)
            .sort({ [sortBy]: order === "desc" ? -1 : 1 });

        const totalProducts = await Product.countDocuments(filter);

        return res.status(200).json({
            code: "PRODUCTS_FOUND",
            message: "Products fetched successfully",
            products,
            pagination: {
                page,
                limit,
                totalProducts,
                totalPages: Math.ceil(totalProducts / limit)
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        })
    }
}

export const getProductByIdController = async (req, res) => {
    try {

        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                code: "PRODUCT_NOT_FOUND",
                message: "Product not found",
            });
        }

        return res.status(200).json({
            code: "PRODUCT_FOUND",
            message: "Product found successfully",
            product,
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        });
    }
}

export const updateProductController = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            description,
            category_id,
            brand,
            key_words,
        } = req.body;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                code: "PRODUCT_NOT_FOUND",
                message: "Product not found",
            });
        }


        const updatedFields = {};

        if (name) updatedFields.name = name;
        if (description) updatedFields.description = description;
        if (category_id) updatedFields.category_id = category_id;
        if (brand) updatedFields.brand = brand;
        if (key_words) updatedFields.key_words = key_words;

        if (category_id) {
            const category = await Category.findById(category_id);

            if (!category) {
                return res.status(404).json({
                    code: "CATEGORY_NOT_FOUND",
                    message: "Category not found",
                });
            }
        }
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id },
            { $set: updatedFields },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            code: "PRODUCT_UPDATED",
            message: "Product updated successfully",
            product: updatedProduct,
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        })
    }
}

export const deleteProductController = async (req, res) => {
    try {
        const { id } = req.params;

        const variantsUsingProduct = await ProductBriefly.findOne({ product_id: id });
        if (variantsUsingProduct) {
            return res.status(400).json({
                code: "PRODUCT_IN_USE",
                message: "Cannot delete product — variants still exist for it",
            });
        }

        const deletedProduct = await Product.findOneAndDelete({ _id: id });
        if (!deletedProduct) {
            return res.status(404).json({
                code: "PRODUCT_NOT_FOUND",
                message: "Product not found",
            });
        }

        return res.status(200).json({
            code: "PRODUCT_DELETED",
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        })
    }
}