import { NextResponse } from "next/server";
import Product from "../../../../models/ProductModel";

export async function POST(req, { params }) {
  try {
    let { prodId } = await params;
    console.log(prodId);

    let prodExists = await Product.findOne({ _id: prodId });
    if (!prodExists) {
      return NextResponse.json(
        { message: "No Product found with this id", sucess: false },
        { status: 404 }
      );
    }
    let variants = await Product.aggregate([
      {
        $match: {
          _id: prodExists._id,
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
                createdAt:1
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
              $match: { $expr: { $eq: ["$productId", "$$productId"] } },
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
          as: "sizes",
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
        $addFields: {
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
                      imgsCount: {
                $size: {
                  $filter: {
                    input: "$allImages",
                    as: "img",
                    cond: {
                      $eq: ["$$img.variantId", "$$variant._id"],
                    },
                  },
                },
              },
                    sizes: {
                      $filter: {
                        input: "$sizes",
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
          productId:prodId
        },
      },
      {
        $project: {
          variants: 1,
          productId:1
        },
      },
    ]);

    return NextResponse.json(
      {
        message: "Variants fetched successfully",
        variants: variants[0].variants || [],
         productId: variants[0]?.productId,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Cant get a Variants.", error, success: false },
      { status: 400 }
    );
  }
}
