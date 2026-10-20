import {body,param,query} from "express-validator"
import mongoose from "mongoose"

export const checkOutValidator =[
body("items")
    .notEmpty().withMessage("Items are required")
    .isArray({ min: 1 }).withMessage("Items must be a non-empty array")
    .custom((items) => {
        for (const { product_variant_id, qty } of items) {
            if (!mongoose.isValidObjectId(product_variant_id)) {
                throw new Error("Invalid product variant id");
            }
            if (!Number.isInteger(qty) || qty < 1) {
                throw new Error("Quantity of each item must be at least 1");
            }
        }
        return true;
    }),

    body("paymentMethod")
        .notEmpty().withMessage("Payment method is required")
        .isIn(["online","COD"]).withMessage("Invalid payment method")
        
]

export const getAllOrdersValidator = [
    query("page")
        .optional()
        .isInt({min:1}).withMessage("Min page number is 1"),
    
    query("limit")
        .optional()
        .isInt({min:10,max:100}).withMessage("Limit should be between 10 and 100"),

    query("sortBy")
        .optional()
        .isIn(["createdAt","amt"]).withMessage("Invalid sort field"),
    
    query("order")
        .optional()
        .isIn(["asc","desc"]).withMessage("Invalid order"),
    
    query("status")
        .optional()
        .isIn(['Pending','Confirmed','Processing','Shipped','Out for delivery','Delivered','Cancelled']).withMessage("Invalid status"),
]

export const orderIdValidator = [
    param("id")
        .isMongoId().withMessage("Invalid order id"),
]

export const updateOrderStatusValidator = [
    body("status")
.notEmpty().withMessage("Status is required")
    .isIn(['Pending','Confirmed','Processing','Shipped','Out for delivery','Delivered','Cancelled']).withMessage("Invalid status"),    
]

