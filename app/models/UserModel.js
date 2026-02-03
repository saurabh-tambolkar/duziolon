import mongoose from "mongoose";
import { type } from "os";

let UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+\@.+\..+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required!"],
    },
    verifyCode: {
      type: String,
      required: [true, "Verify code is required!"],
    },
    verifyCodeExpiry: {
      type: Date,
      required: [true, "Verify code expiry is required!"],
    },
    role:{
      type:String,
      default:"User"
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

mongoose.models.User && delete mongoose.models.User;

const User = mongoose.model("User", UserSchema);

export default User;

