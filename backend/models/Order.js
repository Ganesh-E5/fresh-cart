import mongoose from "mongoose";

const OrderSchema = mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,'User is required'],
        ref:'User',
    },
    date:{
        type:Date,
        default:Date.now,
    },
    amt:{
        type:Number,
        required:[true,'amt is required'],
        min:0,
    },
    status:{
        type:String,
        enum:['Processed','Out for delivery','Cancelled','Delivered'],
        default:'Processed',
    },
})

const Order = mongoose.model('Order',OrderSchema);

export default Order;