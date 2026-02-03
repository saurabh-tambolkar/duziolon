// import { NextResponse } from "next/server";
// import Product from "../../../../models/ProductModel";
// import ConnectDb from "../../../../db/ConnectDb";
// import mongoose from "mongoose";

// export async function POST(req, { params }) {
//   try {
//     await ConnectDb();

//     const { gender } = await params;

//     const products = await Product.aggregate([
//       {
//         $match: { gender },
//       },

//       // 🔥 JOIN VARIANTS
//       {
//         $lookup: {
//           from: "variants",
//           localField: "_id",
//           foreignField: "productId",
//           as: "variants",
//         },
//       },
//       {
//   $lookup: {
//     from: "variants",
//     let: { productId: "$_id" },
// pipeline: [
//   {
//     $match: {
//       $expr: { $eq: ["$productId", "$$productId"] }
//     }
//   },
//   {
//     $project: {
//       _id: 1,
//       color: 1
//     }
//   }
// ],
//     as: "colors"
//   }
// },

//       // 🔥 JOIN SIZES
      // {
      //   $lookup: {
      //     from: "sizes",
      //     localField: "_id",
      //     foreignField: "productId",
      //     as: "sizes",
      //   },
      // },

      // // 🔥 JOIN IMAGES BASED ON MATCHING productId
      // {
      //   $lookup: {
      //     from: "images",
      //     localField: "_id",
      //     foreignField: "productId",
      //     as: "allImages",
      //   },
      // },

//       // 🔥 MERGE images INTO each variant using variantId
      // {
      //   $addFields: {
      //     variants: {
      //       $map: {
      //         input: "$variants",
      //         as: "variant",
      //         in: {
      //           $mergeObjects: [
      //             "$$variant",
      //             {
      //               images: {
      //                 $filter: {
      //                   input: "$allImages",
      //                   as: "img",
      //                   cond: { $eq: ["$$img.variantId", "$$variant._id"] },
      //                 },
      //               },
      //             },
      //           ],
      //         },
      //       },
      //     },
      //   },
      // },

      // // cleanup temporary field
      // { $project: { allImages: 0 } },
//     ]);

//     return NextResponse.json(
//       {
//         message: "Products fetched successfully",
//         products,
//         gender,
//         totalProducts: products.length,
//         success: true,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       {
//         message: "Unable to get products",
//         error: error.message,
//         success: false,
//       },
//       { status: 400 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import Product from "../../../../models/ProductModel";
import ConnectDb from "../../../../db/ConnectDb";
import mongoose from "mongoose";

export async function POST(req, { params }) {
  try {
    await ConnectDb();

    const { gender } = await params;

    let products = await Product.aggregate([
      {
        $match: { gender },
      },
      {
        $lookup:{
          from:'categories',
          localField:'category',
          foreignField:'_id',
          as:"category"
        },
      },
      {
        $unwind:"$category"
      },
      {
  $project: {
    name: 1,
    description: 1,
    gender: 1,
    image: 1,
    sizes: 1,
    colors: 1,
    // 👇 only keep the category field (remove everything else)
    category: "$category.category"
  }
},
      {
        $lookup:{
          from:"sizes",
          let:{productId:'$_id'},
          pipeline:[
            {
              $match:{
                $expr:{$eq:["$productId","$$productId"]}
              }
            },
            {
              $project:{
                _id:0,
                size:1,
                price:1
              }
            },
             { $limit: 1 }
          ],
          as:"sizes"
        }
      },
      {
        $lookup:{
          from:"images",
          let:{productId:"$_id"},
          pipeline:[
            {
              $match:{
                $expr:{$eq:['$productId',"$$productId"]}
              }
            },
            {
              $project:{
                _id:0,
                url:1
              }
            },
            {$limit:1}
          ],
          as:"image"
        }
      },
      {
        $unwind:"$image"
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
    ]);

    return NextResponse.json(
      {
        message: "Products fetched successfully",
        products,
        gender,
        totalProducts: products.length,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Unable to get products",
        error: error.message,
        success: false,
      },
      { status: 400 }
    );
  }
}
