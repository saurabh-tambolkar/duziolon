import mongoose from "mongoose";
import { GENDER_OPTIONS } from "../../lib/genderConstants";

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Categories",
        required:true
    },
    gender:{
        type:String,
        required:true,
        enum:GENDER_OPTIONS
    }
},{timestamps:true})

mongoose.models.Product && delete mongoose.models.Product;

const Product = mongoose.model("Product",ProductSchema);

export default Product;