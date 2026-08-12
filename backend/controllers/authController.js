import User from "../models/User.js";
import jwt from "jsonwebtoken";
export const signupController = async (req, res) => {
    try {
        const {
            username,
            phone,
            email,
            password,
        } = req.body;

        const usernameExists = await User.findOne({ username });
        const emailExists = await User.findOne({ email });
        const phoneExists = await User.findOne({ phone });

        if (usernameExists) {
            return res.status(400).json({
                code: "USERNAME_EXISTS",
                field: "username",
                message: "Username already exists",
            });
        }

        if (emailExists) {
            return res.status(400).json({
                code: "EMAIL_EXISTS",
                field: "email",
                message: "Email already exists",
            });
        }

        if (phoneExists) {
            return res.status(400).json({
                code: "PHONE_EXISTS",
                field: "phone",
                message: "Phone number already exists",
            });
        }

        const newUser = await User.create({
            username,
            phone,
            email,
            password,
        });

        const user = newUser.toObject();
        delete user.password;

        return res.status(201).json({
            code: "SIGNUP_SUCCESS",
            message: "Signup successful",
            user,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        });
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                code: "USER_NOT_FOUND",
                message: "No user found",
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({
                code: "WRONG_PASSWORD",
                message: "Password is wrong",
            });
        }

        const userObj = user.toObject();
        delete userObj.password;

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" },
        );

        return res.status(200).json({
            code: "LOGIN_SUCCESS",
            message: "Login successful",
            token,
            user: userObj,
        })

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        });
    }
}