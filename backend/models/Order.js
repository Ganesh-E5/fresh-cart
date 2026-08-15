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
        enum:['Pending','Confirmed','Processing','Shipped','Out for delivery','Delivered','Cancelled'],
        default:'Pending',
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
})

const Order = mongoose.model('Order',OrderSchema);

export default Order;