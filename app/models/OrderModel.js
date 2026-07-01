import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
    unique:true
  },
  status: {
    type: String,
    required:true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      variantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant",
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      price: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  amount:{
    type:Number,
    required:true
  }
},{timestamps:true});

mongoose.models.Order && delete mongoose.models.Order

let Order = mongoose.model("Order",OrderSchema)

export default Order