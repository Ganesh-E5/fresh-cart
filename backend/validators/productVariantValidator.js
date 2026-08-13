import { body, param, query } from "express-validator";

export const createProductVariantValidator = [
    body("product_id")
        .notEmpty().withMessage("Product id is required")
        .isMongoId().withMessage("Invalid product id"),

    body("img_url")
        .notEmpty().withMessage("Image url is required")
        .isURL().withMessage("Invalid image url"),

    body("size")
        .optional()
        .trim(),

    body("unit")
        .optional()
        .trim(),

    body("sku")
        .trim()
        .notEmpty().withMessage("SKU is required"),

    body("mrp")
        .notEmpty().withMessage("MRP is required")
        .isInt({ min: 0 }).withMessage("MRP must be at leat 0"),

    body("sp")
        .notEmpty().withMessage("SP is required")
        .isInt({ min: 0 }).withMessage("Selling price must be at leat 0"),

    body("qty")
        .optional()
        .isInt({ min: 0 }).withMessage("Quantity must be atleast 0"),

    body("rating")
        .optional()
        .isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5"),

]

export const getAllProductsVariantValidator = [
    query("page")
        .optional()
        .isInt({ min: 1 }).withMessage("Page must be a positive integer")
        .toInt(),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100")
        .toInt(),

    query("category_id")
        .optional()
        .isMongoId().withMessage("Invalid category id"),

    query("brand")
        .optional()
        .trim(),

    query("search")
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage("Search term too long"),

    query("sortBy")
        .optional()
        .isIn(["createdAt", "mrp", "sp", "rating"]).withMessage("Invalid sort field"),

    query("order")
        .optional()
        .isIn(["asc", "desc"]).withMessage("Order must be 'asc' or 'desc'"),
]

export const productVariantIdValidator = [
    param("id")
        .isMongoId().withMessage("Invalid product id")
]

export const updateProductVariantValidator = [
    body("product_id")
        .optional()
        .isMongoId().withMessage("Invalid product id"),

    body("img_url")
        .optional()
        .isURL().withMessage("Invalid image url"),

    body("size")
        .optional()
        .trim(),

    body("unit")
        .optional()
        .trim(),

    body("sku")
        .optional()
        .trim(),

    body("mrp")
        .optional()
        .trim()
        .isInt({ min: 0 }).withMessage("MRP must be at leat 0"),

    body("sp")
        .optional()
        .isInt({ min: 0 }).withMessage("Selling price must be at leat 0"),

    body("qty")
        .optional()
        .isInt({ min: 0 }).withMessage("Quantity must be atleast 0"),

    body("rating")
        .optional()
        .isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5"),

]
