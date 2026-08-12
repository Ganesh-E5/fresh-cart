import { body } from 'express-validator';

export const signupValidator = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .bail()
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),

    body("phone")
        .matches(/^\d{10}$/).withMessage("Invalid phone number"),

    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email address"),

    body("password")
        .notEmpty().withMessage("Password is required")
        .bail()
        .isLength({ min: 6 }).withMessage("Password minimum length is 6"),

];

export const loginValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email address"),

    body("password")
        .notEmpty().withMessage("Password is required"),
];