import { NextResponse } from "next/server";
import ConnectDb from "../../../db/ConnectDb";
import Product from "../../../models/ProductModel";

export async function POST(req) {
  try {
    await ConnectDb();

    const products = await Product.aggregate([
      // 1️⃣ Join category
      {
        $lookup: {
          from: "categories", // collection name (plural, lowercase)
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },

      // 2️⃣ Join variants
      {
        $lookup: {
          from: "variants",
          localField: "_id",
          foreignField: "productId",
          as: "variants",
        },
      },

      // 3️⃣ Join images for variants
      {
        $lookup: {
          from: "images",
          localField: "variants._id",
          foreignField: "variantId",
          as: "variantImages",
        },
      },

      // 4️⃣ Attach images to variants
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
                        input: "$variantImages",
                        as: "img",
                        cond: {
                          $eq: ["$$img.variantId", "$$variant._id"],
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

      // 5️⃣ Extract first image of first variant
      {
        $addFields: {
          image: {
            $arrayElemAt: [
              {
                $arrayElemAt: ["$variants.images", 0],
              },
              0,
            ],
          },
        },
      },

      // 6️⃣ Final shape
      {
        $project: {
          name: 1,
          description: 1,
          gender: 1,
          "category.category": 1,
          image: "$image.url",
           variantsCount: { $size: "$variants" },
          createdAt: 1,
        },
      },
    ]);

    return NextResponse.json(
      {
        message: "Products fetched successfully.",
        products,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Cannot get products right now.", success: false },
      { status: 400 }
    );
  }
}
