import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    isCouponApplied: {
      type: Boolean,
      default: false,
    },
    couponCode: {
      type: String,
      required: function () {
        return this.isCouponApplied;
      },
    },
    couponCodeDiscount: {
      type: Number,
      required: function () {
        return this.isCouponApplied;
      },
    },
    status: {
      type: String,
      default: "PENDING",
      enum: ["PENDING", "SUCCESS", "PREPARED", "DELIVERED"],
    },
    transactionStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },

    paymentStatus: {
      type: String,
      default: "PAYMENT_PENDING",
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
    amount: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
    },
  },
  { timestamps: true },
);

mongoose.models.Order && delete mongoose.models.Order;

let Order = mongoose.model("Order", OrderSchema);

export default Order;
