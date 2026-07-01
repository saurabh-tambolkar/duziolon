import mongoose from "mongoose";

let CouponSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    discount:{
        type:Number,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    },
    expiryDate:{
        type:Date,
        required:true
    }
},{timestamps:true})

mongoose.models.Coupon && delete mongoose.models.Coupon;

let Coupon = mongoose.model("Coupon",CouponSchema)

export default Coupon