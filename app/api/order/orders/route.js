import { NextResponse } from "next/server";
import { checkToken } from "../../../../lib/checkToken";
import mongoose from "mongoose";
import Order from "../../../models/OrderModel";
import ConnectDb from "../../../db/ConnectDb";

export async function POST(req, res) {
  try {
     await ConnectDb();
      let userId = checkToken(req);
      console.log(userId);
      if(!userId){
        return NextResponse.json({ "message":"you are unauthorised", success: false }, { status: 401 });
      }
    let orders = await Order.aggregate([
      {
        $match:{
          $and:[
            { userId: new mongoose.Types.ObjectId(userId) },
            { transactionStatus: "SUCCESS"}
          ]
        } 
      },
      {
        $unwind:"$items"
      },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "prod",
        },
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
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          totalAmount: { $first: "$amount" },
          totalAmountPaid: { $first: "$amountPaid" },
          couponCode: { $first: "$couponCode" },
          couponCodeDiscount: { $first: "$couponCodeDiscount" },
          isCouponApplied: { $first: "$isCouponApplied" },
          orderStatus: { $first: "$status" },
          paymentStatus: { $first: "$paymentStatus" },
          time: { $first: "$updatedAt" },
          items: { $push: "$items" },
        },
      },
    ]);

    return NextResponse.json({ orders,success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error, success: false }, { status: 400 });
  }
}
