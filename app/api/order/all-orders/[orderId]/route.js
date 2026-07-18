import { NextResponse } from "next/server";
import ConnectDb from "../../../../db/ConnectDb";
import Order from "../../../../models/OrderModel";
import { checkToken } from "../../../../../lib/checkToken";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    let { orderId } = await params;
    await ConnectDb()

    let orderDetails = await Order.aggregate([
        {
            $match:{_id:new mongoose.Types.ObjectId(orderId)}
        },
        {
            $unwind:"$items"
        },
        {
            $lookup:{
                from:'products',
                localField:"items.productId",
                foreignField:"_id",
                as:"prod"
            }
        },
        {
        $unwind: "$prod",
      },
        {
        $lookup: {
          from: "variants",
          localField: "items.variantId",
          foreignField: "_id",
          as: "variant",
        },
      },
      {
        $unwind: "$variant",
      },
      {
        $lookup: {
          from: "images",
          let:{variantId:"$items.variantId"},
          pipeline:[
            {
              $match:{
                $expr:{
                  $eq:["$variantId","$$variantId"]
                }
              }
            },
            {
              $project:{
                _id:0,
                url:1
              }
            }
          ],
          as: "images",
        },
      },
      {
        $addFields: {
          "items.product": {
            _id: "$prod._id",
            name: "$prod.name",
            gender: "$prod.gender",
            description: "$prod.description",
            color: "$variant.color",
            price: "$size.price",
            image:{
              $arrayElemAt:["$images",0]
            }
          },
        },
      },
       {
  $lookup: {
    from: "addressmodels", // collection name
    localField: "addressId",
    foreignField: "_id",
    as: "address",
  },
},
{
  $unwind: {
    path: "$address",
    preserveNullAndEmptyArrays: true,
  },
},
{
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          totalAmount: { $first: "$amount" },
          totalAmountPaid: { $first: "$amountPaid" },
          couponCode: { $first: "$couponCode" },
          couponCodeDiscount: { $first: "$couponCodeDiscount" },
          isCouponApplied: { $first: "$isCouponApplied" },
           expectedDeliveryDate: { $first: "$expectedDeliveryDate" },
          orderStatus: { $first: "$status" },
          paymentStatus: { $first: "$paymentStatus" },
          time: { $first: "$updatedAt" },
          address: {
      $first: {
        flat: "$address.flat",
        street: "$address.street",
        landmark: "$address.landmark",
        city: "$address.city",
        taluqa: "$address.taluqa",
        district: "$address.district",
        state: "$address.state",
        country: "$address.country",
        postalCode: "$address.postalCode",
      },
    },
          items: { $push: "$items" },
        },
      },
    ]);

    return NextResponse.json(
      { message: "Order details fetched", success: true,orderDetails },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error, success: false }, { status: 400 });
  }
}
