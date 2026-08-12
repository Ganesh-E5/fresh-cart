import { body, param } from "express-validator";

export const createCategoryValidator = [
    body("name")
        .trim()
        .notEmpty().withMessage("Category name is required"),

    body("img_url")
        .trim()
        .notEmpty().withMessage("Image link is required")
        .bail()
        .isURL().withMessage("Invalid image url"),

]
export const categoryIdValidator = [
    param("id")
        .isMongoId().withMessage("Invalid category id"),
]

export const updateCategoryValidator = [
    body("name")
        .optional()
        .trim()
        .notEmpty().withMessage("Category name cannot be empty"),

    body("img_url")
        .optional()
        .trim()
        .isURL().withMessage("Invalid image url"),
]