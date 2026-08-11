import mongoose from "mongoose";

const CategorySchema = mongoose.Schema({
    name: {
        type:String,
        required:[true,'Name is required'],
        unique:true,
    },
    img_url:{
        type:String,
        requirde:[true,'Image is required']
    }
},{
    timestamps: true
});

const Category = mongoose.model('Category',CategorySchema)

export default Category;