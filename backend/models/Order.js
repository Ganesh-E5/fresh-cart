import mongoose from "mongoose";
import { ORDER_STATUSES, PAYMENT_METHODS, PAYMENT_STATUSES } from "../constants/order.js";

const OrderSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "User is required"],
            ref: "User",
        },
        date: {
            type: Date,
            default: Date.now,
        },
        amt: {
            type: Number,
            required: [true, "amt is required"],
            min: 0,
        },
        status: {
            type: String,
            enum: ORDER_STATUSES,
            default: "Placed",
        },
        paymentMethod: {
            type: String,
            enum: PAYMENT_METHODS,
            required: [true, "Payment method is required"],
        },
        paymentStatus: {
            type: String,
            enum: PAYMENT_STATUSES,
            default: "Unpaid",
        },
        shippingAddress: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            houseNo: { type: String, required: true },
            street: { type: String, required: true },
            landmark: String,
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
            country: { type: String, required: true, default: "India" },
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;