import Category from "../models/Category.js";

export const createCategoryController = async (req, res) => {
    try {
        const {
            name,
            img_url,
        } = req.body;

        const categoryName = await Category.findOne({ name });

        if (categoryName) {
            return res.status(400).json({
                code: "CATEGORY_EXISTS",
                message: "Category already exists",
            });
        }

        const category = await Category.create({
            name,
            img_url,
        })

        return res.status(201).json({
            code: "CATEGORY_CREATED",
            message: "Category created successfully",
            category,
        })

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        });
    }
};

export const getAllCategoryController = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({
            code: "CATEGORIES_FETCHED",
            message: "Categories fetched successfully",
            categories,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        });
    }
};

export const getCategoryByIdController = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                code: "CATEGORY_NOT_FOUND",
                message: "Category not found",
            })
        }

        return res.status(200).json({
            code: "CATEGORY_FOUND",
            message: "Category found successfully",
            category,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        });
    }
};

export const updateCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            img_url,
        } = req.body;

        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (img_url) updatedFields.img_url = img_url;

        const category = await Category.findOneAndUpdate(
            { _id: id },
            { $set: updatedFields },
            { new: true, runValidators: true }
        );
        if (!category) {
            return res.status(404).json({
                code: "CATEGORY_NOT_FOUND",
                message: "Category not found",
            })
        }
        return res.status(200).json({
            code: "CATEGORY_UPDATED",
            message: "Category updated successfully",
            category,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        });
    }
};

export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await Category.findOneAndDelete({ _id: id });
        if (!deletedCategory) {
            return res.status(404).json({
                code: "CATEGORY_NOT_FOUND",
                message: "Catgeory not found",
            });
        }
        return res.status(200).json({
            code: "CATEGORY_DELETED",
            message: "Category deleted successfully",
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        });
    }
};