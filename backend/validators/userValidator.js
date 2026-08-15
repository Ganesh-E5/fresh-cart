import {body, query, param } from "express-validator";

export const getAllUsersValidator = [
    query("page")
        .optional()
        .isInt({ min: 1 }).withMessage("Page must be a positive integer"),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),

    query("search")
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage("Search term too long"),

    query("role")
        .optional()
        .isIn(["customer", "admin"]).withMessage("Invalid role"),
];

export const userIdValidator = [
    param("id")
        .isMongoId().withMessage("Invalid user id"),
];

export const updateProfileValidator = [
    body("username")
        .optional()
        .trim()
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),

    body("email")
        .optional()
        .trim().
        isEmail().withMessage("Invalid email address"),

    body("phone")
        .optional()
        .matches(/^\d{10}$/).withMessage("Invalid phone number"),    

]

export const changePasswordValidator = [
    body("currentPassword")
        .notEmpty().withMessage("Current password is required"),

    body("newPassword")
        .notEmpty().withMessage("New password is required")
        .isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),

];

export const forgotPasswordValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email address"),

];
 
export const resetPasswordValidator = [
    body("token")
        .trim()
        .notEmpty().withMessage("Reset token is required"),
    body("newPassword")
        .notEmpty().withMessage("New password is required")
        .isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
];

export const addAddressValidator = [
    body("name")
        .trim()
        .notEmpty().withMessage("Name is required"),

    body("phone")
        .notEmpty().withMessage("Phone number is required")
        .matches(/^\d{10}$/).withMessage("Invalid phone number"),

    body("houseNo")
        .trim()
        .notEmpty().withMessage("House number is required"),

    body("street")
        .trim()
        .notEmpty().withMessage("Street is required"),

    body("landmark")
        .optional()
        .trim(),

    body("city")
        .trim()
        .notEmpty().withMessage("City is required"),

    body("state")
        .trim()
        .notEmpty().withMessage("State is required"),

    body("pincode")
        .notEmpty().withMessage("Pincode is required")
        .matches(/^[1-9][0-9]{5}$/).withMessage("Invalid pincode"),

    body("country")
        .optional()
        .trim(),

    body("isDefault")
        .optional()
        .isBoolean().withMessage("isDefault must be true or false"),
];

export const updateAddressValidator = [
    param("addressId")
        .isMongoId().withMessage("Invalid address id"),

    body("name")
        .optional()
        .trim()
        .notEmpty().withMessage("Name is required"),

    body("phone")
        .optional()
        .notEmpty().withMessage("Phone number is required")
        .matches(/^\d{10}$/).withMessage("Invalid phone number"),

    body("houseNo")
        .optional()
        .trim()
        .notEmpty().withMessage("House number is required"),

    body("street")
        .optional()
        .trim()
        .notEmpty().withMessage("Street is required"),

    body("landmark")
        .optional()
        .trim(),

    body("city")
        .optional()
        .trim()
        .notEmpty().withMessage("City is required"),

    body("state")
        .optional()
        .trim()
        .notEmpty().withMessage("State is required"),

    body("pincode")
        .optional()
        .notEmpty().withMessage("Pincode is required")
        .matches(/^[1-9][0-9]{5}$/).withMessage("Invalid pincode"),

    body("country")
        .optional()
        .trim()
        .notEmpty().withMessage("Country is required"),

    body("isDefault")
        .optional()
        .isBoolean().withMessage("isDefault must be true or false"),
];

export const addressIdValidator = [
    param("addressId").isMongoId().withMessage("Invalid address id"),
];