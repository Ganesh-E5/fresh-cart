import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        match: [/^\d{10}$/, 'Invalid phone number'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password minimum length is 6'],
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer',
    },
    addresses: [{
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        phone: {
            type: String,
            required: [true, "Phone nubmer is required"],
            match: [/^\d{10}$/, "Invalid phone number"],
        },
        houseNo: {
            type: String,
            required: [true, "House number is required"],
        },
        street: {
            type: String,
            required: [true, "Street is required"],
        },
        landmark: String,
        city: {
            type: String,
            required: [true, "City is required"],
        },
        state: {
            type: String,
            required: [true, "State is required"],
        },
        pincode: {
            type: String,
            required: [true, "Pincode is required"],
            match: [/^[1-9][0-9]{5}$/, "Invalid pincode"],
        },
        country: {
            type: String,
            default: "India",
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
    }],

        resetPasswordToken:{
            type:String,
            select:false,
        },
        resetPasswordExpires:{
type:Date,
select:false,
        },
}, {
    timestamps: true,
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;