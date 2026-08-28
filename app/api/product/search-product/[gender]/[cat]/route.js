// import ConnectDb from "@/app/db/ConnectDb";
// import Product from "@/app/models/ProductModel";
// import Categories from "@/app/models/CategoriesModel";
// import Variant from "@/app/models/VariantModel";
// import { NextResponse } from "next/server";

// export async function GET(req, { params }) {
//   try {
//     await ConnectDb();
//     let { gender, cat } = await params;
//     let searchParams = req.nextUrl.searchParams;
//     let query = searchParams.get("query")?.trim() || "";

//     const words = query
//   .toLowerCase()
//   .replace(/-/g, " ")
//   .split(/\s+/)
//   .filter(Boolean);

//     console.log(cat, query);

//     let category = await Categories.findOne({ category: cat });
//     console.log(category);

//   const products = await Product.aggregate([
//   {
//     $match: {
//       category: category._id,
//       gender: gender,
//     },
//   },

//   {
//     $lookup: {
//       from: "variants",
//       localField: "_id",
//       foreignField: "prodId",
//       as: "variants",
//     },
//   },
//   {
//     $match: {
//       $and: words.map((word) => ({
//         $or: [
//           {
//             name: {
//               $regex: word,
//               $options: "i",
//             },
//           },
//           {
//             description: {
//               $regex: word,
//               $options: "i",
//             },
//           },
//           {
//             "variants.color": {
//               $regex: word,
//               $options: "i",
//             },
//           },
//         ],
//       })),
//     },
//   },
//    {
//         $lookup: {
//           from: "sizes",
//           let: { productId: "$_id" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: { $eq: ["$productId", "$$productId"] },
//               },
//             },
//             {
//               $project: {
//                 _id: 0,
//                 size: 1,
//                 price: 1,
//               },
//             },
//             { $limit: 1 },
//           ],
//           as: "sizes",
//         },
//       },
//        {
//         $lookup: {
//           from: "images",
//           let: { productId: "$_id" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: { $eq: ["$productId", "$$productId"] },
//               },
//             },
//             {
//               $project: {
//                 _id: 0,
//                 url: 1,
//               },
//             },
//             { $limit: 1 },
//           ],
//           as: "image",
//         },
//       },
//       {
//         $unwind: "$image",
//       },
//        {
//         $lookup: {
//           from: "variants",
//           let: { productId: "$_id" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: { $eq: ["$productId", "$$productId"] },
//               },
//             },
//             {
//               $project: {
//                 _id: 1,
//                 color: 1,
//               },
//             },
//           ],
//           as: "colors",
//         },
//       },
// //   {
// //     $project: {
// //         variants:0
// //     },
// //   },
// ]);
//     return NextResponse.json(
//       {
//         message: "Products found",
//         length: products.length,
//         success: true,
//         products,
//       },
//       { status: 200 },
//     );
//   } catch (err) {
//     console.log(err);
//     return NextResponse.json(
//       { message: "Cant get products", success: false },
//       { status: 400 },
//     );
//   }
// }


import ConnectDb from "@/app/db/ConnectDb";
import Product from "@/app/models/ProductModel";
import Categories from "@/app/models/CategoriesModel";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await ConnectDb();

    const { gender, cat } = await params;

    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("query")?.trim() || "";

    console.log("Gender:", gender);
    console.log("Category:", cat);
    console.log("Query:", query);

    // Normalize search query
    const words = query
      .toLowerCase()
      .replace(/-/g, " ")
      .split(/\s+/)
      .filter(Boolean);

    // -----------------------------------
    // 1. Base product filter
    // -----------------------------------

    const productMatch = {
      gender: gender,
    };

    // -----------------------------------
    // 2. Category filter
    // -----------------------------------

    if (cat.toLowerCase() !== "all") {
      const category = await Categories.findOne({
        _id: cat,
      });

      console.log("Category:", category);

      if (!category) {
        return NextResponse.json(
          {
            message: "Category not found",
            success: false,
          },
          { status: 404 }
        );
      }

      productMatch.category = category._id;
    }

    // -----------------------------------
    // 3. Aggregation pipeline
    // -----------------------------------

    const pipeline = [
      // Category + gender
      {
        $match: productMatch,
      },

      // Get variants for color searching
      {
        $lookup: {
          from: "variants",
          localField: "_id",
          foreignField: "prodId",
          as: "variants",
        },
      },
      {
  $lookup: {
    from: "categories",
    localField: "category",
    foreignField: "_id",
    as: "categoryData",
  },
},
{
  $unwind: "$categoryData",
},
    ];

    // -----------------------------------
    // 4. Search only if query exists
    // -----------------------------------

    if (words.length > 0) {
      pipeline.push({
        $match: {
          $and: words.map((word) => ({
            $or: [
              {
                name: {
                  $regex: word,
                  $options: "i",
                },
              },
              {
                description: {
                  $regex: word,
                  $options: "i",
                },
              },
              {
                "variants.color": {
                  $regex: word,
                  $options: "i",
                },
              },
            ],
          })),
        },
      });
    }

    // -----------------------------------
    // 5. Get first size
    // -----------------------------------

    pipeline.push({
      $lookup: {
        from: "sizes",
        let: {
          productId: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$productId", "$$productId"],
              },
            },
          },
          {
            $project: {
              _id: 0,
              size: 1,
              price: 1,
            },
          },
          {
            $limit: 1,
          },
        ],
        as: "sizes",
      },
    });

    // -----------------------------------
    // 6. Get first product image
    // -----------------------------------

    pipeline.push({
      $lookup: {
        from: "images",
        let: {
          productId: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$productId", "$$productId"],
              },
            },
          },
          {
            $project: {
              _id: 0,
              url: 1,
            },
          },
          {
            $limit: 1,
          },
        ],
        as: "image",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$image",
        preserveNullAndEmptyArrays: true,
      },
    });

    // -----------------------------------
    // 7. Get product colors
    // -----------------------------------

    pipeline.push({
      $lookup: {
        from: "variants",
        let: {
          productId: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$productId", "$$productId"],
              },
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
    });

    // -----------------------------------
    // 8. Remove unnecessary variants
    // -----------------------------------

  pipeline.push({
  $project: {
    _id: 1,
    name: 1,
    description: 1,
    gender: 1,

    category: "$categoryData.category",

    image: {
        url:"$image.url",
    },

    sizes: 1,
    colors: 1,

    variantsCount: {
      $size: "$variants",
    },

    createdAt: 1,
  },
});
    const products = await Product.aggregate(pipeline);

    return NextResponse.json(
      {
        message: "Products found",
        length: products.length,
        success: true,
        products,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      {
        message: "Cant get products",
        success: false,
      },
      { status: 400 }
    );
  }
}