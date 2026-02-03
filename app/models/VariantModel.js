import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
  },
  productId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Product",
    required:true
  }
},{timestamps:true});

mongoose.models.Variant && delete mongoose.models.Variant;

const Variant = mongoose.model("Variant",variantSchema)

export default Variant;