import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: true,
      enum: ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36"], // add what you need
    },
    price: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    variantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Variant",
        required:true
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    }
  },
  { timestamps: true }
);

mongoose.models.Size && delete mongoose.models.Size;

const Size = mongoose.model("Size", sizeSchema);

export default Size;
