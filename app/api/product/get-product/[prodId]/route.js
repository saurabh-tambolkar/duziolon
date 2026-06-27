import { NextResponse } from "next/server";
import Product from "../../../../models/ProductModel";
import { checkToken } from "../../../../../lib/checkToken";
import mongoose from "mongoose";

export async function POST(req, { params }) {
  try {
    let { prodId } = await params;
    let userId = checkToken(req)
    console.log("prodId", prodId,userId);
    let prodExists = await Product.findOne({ _id: prodId });
    console.log(userId);
    if (!prodExists) {
      return NextResponse.json(
        { message: "No product found with this ID", success: false },
        { status: 404 }
      );
    }

    let prodDetails = await Product.aggregate([
      {
        $match: { _id: prodExists._id },
      },
      {
        $lookup: {
          from: "variants",
          let: { productId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$productId", "$$productId"] },
              },
            },
            {
              $project: {
                _id: 1,
                color: 1,
                // size:1
              },
            },
          ],
          as: "variants",
        },
      },
     {
    $lookup: {
      from: "sizes",
      let: { productId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$productId", "$$productId"] },
          },
        },
        {
          $project: {
            _id: 1,
            size: 1,
            price: 1,
            stock: 1,
            variantId: 1,
          },
        },
      ],
      as: "allSizes",
    },
  },
      {
        $lookup: {
          from: "variants",
          let: { productId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$productId", "$$productId"] },
              },
            },
            {
              $project: {
                _id: 1,
                color: 1,
              },
            },
          ],
          as: "colors",
        },
      },

      {
        $lookup: {
          from: "images",
          let: { productId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$productId", "$$productId"] },
              },
            },
            {
              $project: {
                _id: 1,
                url: 1, // keep only url
                variantId: 1, // required for grouping images by variant
              },
            },
          ],
          as: "allImages",
        },
      },
      {
        $lookup:{
          from:'wishlists',
          let: { productId: "$_id",userId: new mongoose.Types.ObjectId(userId), },
           pipeline: [
            {
              $match: {
                $expr: {
                  $and:[
                    {$eq: ["$productId", "$$productId"]},
                  {  $eq: ["$userId", "$$userId"]},
                  ] 
                }
              },
            },
          ],
          as: "wishlists",
        }
      },
      {
        $addFields: {
          isWishlisted:{
            $gt:[
              {$size:"$wishlists"},0
    ]
          },
          variants: {
            $map: {
              input: "$variants",
              as: "variant",
              in: {
                $mergeObjects: [
                  "$$variant",
                  {
                    images: {
                      $filter: {
                        input: "$allImages",
                        as: "img",
                        cond: { $eq: ["$$img.variantId", "$$variant._id"] },
                      },
                    },
                    sizes: {
                      $filter: {
                        input: "$allSizes",
                        as: "size",
                        cond: {
                          $eq: ["$$size.variantId", "$$variant._id"],
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },

      // cleanup temporary field
      { $project: { allImages: 0,wishlists:0 } },
    ]);

    return NextResponse.json(
      {
        message: "Product details fetched successfully.",
        prodDetails,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Cant get a product details.", error, success: false },
      { status: 400 }
    );
  }
}
