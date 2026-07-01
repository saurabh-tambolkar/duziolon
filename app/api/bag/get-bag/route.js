import { NextResponse } from "next/server";
import { checkToken } from "../../../../lib/checkToken";
import Bag from "../../../models/BagModel";
import mongoose from "mongoose";

export async function POST(req, res) {
  try {
    let userId = checkToken(req);
    console.log(userId);
    let bag = await Bag.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $unwind: "$items",
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
    from: "sizes",
    let: {
      variantId: "$items.variantId",
      size: "$items.size",
    },
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ["$variantId", "$$variantId"] },
              { $eq: ["$size", "$$size"] },
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          price: 1,
        },
      },
    ],
    as: "size",
  },
},
{
  $unwind: "$size",
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
          totalAmount: { $first: "$totalAmount" },
          items: { $push: "$items" },
        },
      },
      {
        $project: {
          userId: 1,
          totalAmount: 1,
          items: 1,
        },
      },
    ]);

    return NextResponse.json({ bag:bag[0], success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error, success: false }, { status: 400 });
  }
}
