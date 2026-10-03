import { body, param,query } from "express-validator";

export const createProductValidator = [
    body("name")
        .trim()
        .notEmpty().withMessage("Product name is required"),

    body("description")
        .trim()
        .notEmpty().withMessage("Product description is required"),

    body("category_id")
        .isMongoId().withMessage("Invalid category id"),

    body("brand")
        .optional()
        .trim(),

    body("key_words")
        .optional()
        .isArray().withMessage("Key words must be an array")
        .bail()
        .custom((keywords) => {
            if (!keywords.every(keyword => typeof keyword === "string")) {
                throw new Error("Every key word must be a string");
            }

            return true;
        })
        .customSanitizer((keywords) =>
            keywords
                .map(keyword => keyword.trim().toLowerCase())
                .filter(Boolean)
        ),

]

export const getAllProductsValidator = [
    query("page")
        .optional()
        .isInt({ min: 1 }).withMessage("Page must be a positive integer")
        .toInt(),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100000 }).withMessage("Limit must be between 1 and 100")
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
        .isIn(["createdAt", "name", "brand"]).withMessage("Invalid sort field"),

    query("order")
        .optional()
        .isIn(["asc", "desc"]).withMessage("Order must be 'asc' or 'desc'"),
];

export const productIdValidator = [
    param("id")
        .isMongoId().withMessage("Invalid product id"),
]

export const updateProductValidator = [
    body("name")
        .optional()
        .trim()
        .notEmpty().withMessage("Product name is required"),

    body("description")
        .optional()
        .trim()
        .notEmpty().withMessage("Product description is required"),

    body("category_id")
        .optional()
        .isMongoId().withMessage("Invalid category id"),

    body("brand")
        .optional()
        .trim(),

    body("key_words")
        .optional()
        .isArray().withMessage("Key words must be an array")
        .bail()
        .custom((keywords) => {
            if (!keywords.every(keyword => typeof keyword === "string")) {
                throw new Error("Every key word must be a string");
            }

            return true;
        })
        .customSanitizer((keywords) =>
            keywords
                .map(keyword => keyword.trim().toLowerCase())
                .filter(Boolean)
        ),
]