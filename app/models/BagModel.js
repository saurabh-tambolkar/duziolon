import mongoose from "mongoose";

let BagSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        unique:true
    },
    items:[
        {
             productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    variantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Variant',
        required:true
    },
    size:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    quantity:{
                type:Number,
                default:1
            }
        }
    ],
    totalAmount:{
        type:Number,
        required:true
    }
},{timeStamps:true})

mongoose.models.Bag && delete mongoose.models.Bag;

let Bag = mongoose.model("Bag",BagSchema)

export default Bag