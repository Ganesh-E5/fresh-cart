import User from "../models/User.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

export const getAllUsersController = async (req, res) => {
    try {
        let {
            page = 1,
            limit = 20,
            search,
            role
        } = req.query;

        page = Number(page);
        limit = Number(limit);

        const filters = {};
        if (role) filters.role = role;
        if (search) {
            filters.$or = [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;

        const users = await User.find(filters)
            .select("-password")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalUsers = await User.countDocuments(filters);

        return res.status(200).json({
            code: "USERS_FETCHED",
            message: "Users fetched successfully",
            users,
            pagination: {
                page,
                limit,
                totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        });
    }
};

export const getUserByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({
                code: "USER_NOT_FOUND",
                message: "User not found",
            });
        }
        return res.status(200).json({
            code: "USER_FOUND",
            message: "User fetched successfully",
            user,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        });
    }
};

export const getProfileController = async (req, res) => {
    return res.status(200).json({
        code: "PROFILE_FETCHED",
        message: "Profile fetched successfully",
        user: req.user,
    })
}

export const updateProfileController = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { username, email, phone } = req.body;

        const updateFields = {};
        if (username) updateFields.username = username;
        if (email) updateFields.email = email;
        if (phone) updateFields.phone = phone;

        const updatedUser = await User.findByIdAndUpdate(
            user_id,
            { $set: updateFields },
            { returnDocument: "after", runValidators: true }
        ).select("-password");

        return res.status(200).json({
            code: "PROFILE_UPDATED",
            message: "Profile updated successfully",
            user: updatedUser,
        })
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                code: "DUPLICATE_FIELD",
                field,
                message: `${field} already in use`
            })
        }
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        });
    }
}

export const changePasswordController = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                code: "WRONG_PASSWORD",
                message: "Current password is incorrect"
            })
        }
        user.password = newPassword;
        await user.save();
        return res.status(200).json({
            code: "PASSWORD_CHANGED",
            message: "Password chnaged successfully"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        });
    }
}

export const addAddressController = async (req, res) => {
    try {
        const user_id = req.user.id;
        const {
            name,
            phone,
            houseNo,
            street,
            landmark,
            city,
            state,
            pincode,
            country,
            isDefault
        } = req.body;

        const user = await User.findById(user_id);

        const shouldBeDefault = user.addresses.length === 0 ? true : isDefault;

        if (shouldBeDefault) {
            user.addresses.forEach(addr => { addr.isDefault = false });
        }

        user.addresses.push({
            name, phone, houseNo, street, landmark, city, state, pincode, country,
            isDefault: shouldBeDefault,
        });

        await user.save();

        return res.status(201).json({
            code: "ADDRESS_ADDED",
            message: "Address added successfully",
            addresses: user.addresses,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        });
    }
}

export const getAddressesController = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("addresses");
        return res.status(200).json({
            code: "ADDRESSES_FETCHED",
            message: "Addresses fetched successfully",
            addresses: user.addresses,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" });
    }
};

export const updateAddressController = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { addressId } = req.params;
        const {
            name,
            phone,
            houseNo,
            street,
            landmark,
            city,
            state,
            pincode,
            country,
            isDefault } = req.body;

        const user = await User.findById(user_id);
        const address = user.addresses.id(addressId);

        if (!address) {
            return res.status(404).json({
                code: "ADDRESS_NOT_FOUND",
                message: "Address not found"
            });
        }

        if (isDefault) {
            user.addresses.forEach(addr => { addr.isDefault = false; });
        }

        if (name) address.name = name;
        if (phone) address.phone = phone;
        if (houseNo) address.houseNo = houseNo;
        if (street) address.street = street;
        if (landmark) address.landmark = landmark;
        if (city) address.city = city;
        if (state) address.state = state;
        if (pincode) address.pincode = pincode;
        if (country) address.country = country;
        if (isDefault) address.isDefault = isDefault;

        await user.save();

        return res.status(200).json({
            code: "ADDRESS_UPDATED",
            message: "Address updated successfully",
            addresses: user.addresses,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" });
    }
};

export const deleteAddressController = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { addressId } = req.params;

        const user = await User.findById(user_id);
        const address = user.addresses.id(addressId);

        if (!address) {
            return res.status(404).json({
                code: "ADDRESS_NOT_FOUND",
                message: "Address not found"
            });
        }

        const wasDefault = address.isDefault;
        address.deleteOne();

        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();

        return res.status(200).json({
            code: "ADDRESS_DELETED",
            message: "Address deleted successfully",
            addresses: user.addresses,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" });
    }
};


export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                code: "RESET_EMAIL_SENT",
                message: "If that email is registered, a reset link has been sent.",
            });
        }

        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

        const html = `
            <p>Hello ${user.username},</p>
            <p>You requested a password reset for your Fresh-Cart account.</p>
            <p><a href="${resetUrl}">Click here to reset your password</a></p>
            <p>This link expires in 15 minutes. If you didn't request this, you can ignore this email.</p>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: "Reset your Fresh-Cart password",
                html,
            });
        } catch (emailError) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save({ validateBeforeSave: false });

            console.error(emailError);
            return res.status(500).json({
                code: "EMAIL_FAILED",
                message: "Could not send reset email. Please try again later.",
            });
        }

        return res.status(200).json({
            code: "RESET_EMAIL_SENT",
            message: "If that email is registered, a reset link has been sent.",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" });
    }
};

export const resetPasswordController = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        }).select("+resetPasswordToken +resetPasswordExpires");

        if (!user) {
            return res.status(400).json({
                code: "INVALID_OR_EXPIRED_TOKEN",
                message: "This reset link is invalid or has expired",
            });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({
            code: "PASSWORD_RESET",
            message: "Password has been reset successfully. You can now log in.",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" });
    }
};
