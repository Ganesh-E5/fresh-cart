import mongoose from "mongoose";
import { type } from "node:os";

const ProductBrieflySchema = mongoose.Schema({
    product_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:[true,'Product reference is needed'],
    },
    img_url:{
        type:String,
        required:[true,'Image is required'],
    },
    size:{
        type:String,
    },
    unit:{
        type:String,
    },
    sku:{
        type:String,
        required:[true,'SKU is required'],
    },
    mrp:{
        type:Number,
        required:[true,'MRP is required'],
    },
    sp:{
        type:Number,
        required:[true,'SP is required'],
    },
    qty:{
        type:Number,
        default:0,
    },
    rating:{
        type:Number,
        default:0,
        min:0,
        max:5,
    }
});

const ProductBriefly = mongoose.model('ProductBriefly',ProductBrieflySchema);

export default ProductBriefly;