import mongoose from "mongoose";

const OrderItemSchema = mongoose.Schema({
    order_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Order',
        required:[true,'Order is required'],
    },
    product_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:[true,'Product is required'],
    },
    sku:{
        type:String,
        required:[true,'SKU is required'],
    },
    qty:{
        type:Number,
        required:[true,"Quantity is required"],
        min:1,
    },
    price:{
        type:Number,
        required:[true,"Price is required"],
        min:1,
    },
});

const OrderItem = mongoose.model('OrderItem',OrderItemSchema);

export default OrderItem;