import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
    },
    description:{
        type:String,
        required:[true,'Description is required'],
    },
    category_id:{
        type:mongoose.Schema.Types.ObjectId, ref:'Category',required:true
    },
    brand:{
        type:String,
    },
    key_words:[
        String,
    ]
});

const Product = mongoose.model('Product',ProductSchema);

export default Product;