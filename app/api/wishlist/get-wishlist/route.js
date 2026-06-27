import { NextResponse } from "next/server";
import { checkToken } from "../../../../lib/checkToken";
import ConnectDb from "../../../db/ConnectDb";
import Wishlist from "../../../models/WishlistModel";
import mongoose from "mongoose";

export async function GET(req, res) {
  await ConnectDb();
  try {
    let userId = checkToken(req);
    if (!userId) {
      return NextResponse.json(
        { message: "You are unauthorised", success: false },
        { status: 401 },
      );
    }
    // let wishlist = await Wishlist.find({userId})

    const wishlist = await Wishlist.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $lookup: {
          from: "categories",
          localField: "product.category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
          $lookup:{
              from:"images",
              localField:"productId",
              foreignField:"productId",
              as:"images"
            }
        },
        {
            $lookup:{
                from:"sizes",
                localField:"productId",
                foreignField:"productId",
                as:"sizes"
            }
        },
      {
        $addFields: {
          "product.categoryName": "$category.category",
          "product.sizes": {
            $setUnion:[
                {
                    $map:{
                        input:"$sizes",
                        as:'size',
                        in:"$$size.size"
                    }
                }
            ]
          },
          "product.image": {
            $arrayElemAt:["$images",0],
        },
        "product.price":{
            $arrayElemAt:["$sizes",0]
        }
        },
      },
      {
        $project: {
          _id: 1,
          productId: 1,
          "product.price.price":1,
          "product.image.url":1,
          "product.name": 1,
          "product.description": 1,
          "product.gender": 1,
          "product.categoryName": 1,
          "product.sizes":1
        },
      },
    ]);

    return NextResponse.json(
      { wishlist, success: true, userId },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error, success: false }, { status: 400 });
  }
}
