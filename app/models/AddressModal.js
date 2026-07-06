import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    flat: {
        type: String,
    },
    street: {
        type: String,
    },
    landmark: {
        type: String,
    },
    city: {
        type: String,
    },
    taluqa: {
        type: String,
    },
    district: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
        default: "India",
    },
    postalCode: {
        type: String,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

mongoose.models.AddressModel && delete mongoose.models.AddressModel;
const AddressModel = mongoose.model("AddressModel", AddressSchema);
export default AddressModel;