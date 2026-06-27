import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    }
},{timeStamps:true})

mongoose.models.Wishlist && delete mongoose.models.Wishlist

const Wishlist = mongoose.model("Wishlist",WishlistSchema)

export default Wishlist