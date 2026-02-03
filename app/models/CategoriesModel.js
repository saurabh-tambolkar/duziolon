import mongoose from "mongoose";

const CategoriesSchema = new mongoose.Schema({
    category:{
        type:String,
        required:true,
        unique:true,
    },
    isActive:{
        type:Boolean,
        default:true,
        required:true
    }
},{ timestamps: true });

mongoose.models.Categories && delete mongoose.models.Categories;

const Categories = mongoose.model("Categories",CategoriesSchema)

export default Categories;