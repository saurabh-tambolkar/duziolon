import { NextResponse } from "next/server";
import { checkToken } from "../../../../lib/checkToken";
import mongoose from "mongoose";
import Order from "../../../models/OrderModel";

export async function POST(req, res) {
  try {
      let userId = checkToken(req);
      console.log(userId);
      if(!userId){
        return NextResponse.json({ "message":"you are unauthorised", success: false }, { status: 401 });
      }
    let orders = await Order.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
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
