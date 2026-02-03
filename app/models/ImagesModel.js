import mongoose from "mongoose";
import { ref } from "process";

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
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

mongoose.models.Image && delete mongoose.models.Image;

const Image = mongoose.model("Image", imageSchema);

export default Image;
