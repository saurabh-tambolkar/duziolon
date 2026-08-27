import { NextResponse } from "next/server";
import { checkToken } from "../../../../lib/checkToken";
import mongoose from "mongoose";
import Order from "../../../models/OrderModel";
import ConnectDb from "../../../db/ConnectDb";
import redis from "@/lib/redis"

export async function POST(req, res) {
  try {
     await ConnectDb();
      let userId = checkToken(req);
      console.log(userId);
      let cacheKey = `orders:${userId}`

      let cachedOrders = await redis.get(cacheKey)
      cachedOrders  = JSON.parse(cachedOrders)

      if(cachedOrders){
        console.log("sending orders from redis")
         return NextResponse.json({ orders:cachedOrders,success: true,source:"Redis" }, { status: 200 });
      }

      console.log("cache miss",userId)

      if(!userId){
        return NextResponse.json({ "message":"you are unauthorised", success: false, }, { status: 401 });
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
  $sort: {
    createdAt: -1
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
          deliveryDate: { $first: "$deliveryDate" },
          orderStatus: { $first: "$status" },
          paymentStatus: { $first: "$paymentStatus" },
          time: { $first: "$createdAt" },
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

    await redis.set(
      cacheKey,
      JSON.stringify(orders),
      "EX",
      300
    )

    return NextResponse.json({ orders,success: true,source:"Mongodb"}, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error, success: false }, { status: 400 });
  }
}
