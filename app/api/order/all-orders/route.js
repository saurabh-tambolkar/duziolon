import { NextResponse } from "next/server";
import ConnectDb from "../../../db/ConnectDb";
import Order from "../../../models/OrderModel";

export async function GET(req){
    try {
        await ConnectDb();
        let allOrders = await Order.aggregate([
            {
                $match:{}
            },
            {
                $unwind:"$items"
            },
            {
                $lookup:{
                    from:"products",
                    localField:"items.productId",
                    foreignField:"_id",
                    as:"products"
                }
            },
            {
                $unwind:"$products"
            },
            {
                $lookup:{
                    from:"users",
                    localField:"userId",
                    foreignField:"_id",
                    as:"user"
                }
            },
            {
                $unwind:"$user"
            },
            {
                $lookup:{
                    from:"variants",
                    localField:"items.variantId",
                    foreignField:"_id",
                    as:"variants"
                }
            },
            {
                $unwind:"$variants"
            },
            {
                $lookup:{
                    from:"images",
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
                    as:"images"
                }
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
          userName:{$first:"$user.name"},
          userEmail:{$first:"$user.email"},
          userPhone:{$first:"$user.phone"},
          totalAmount: { $first: "$amount" },
          totalAmountPaid: { $first: "$amountPaid" },
          couponCode: { $first: "$couponCode" },
          couponCodeDiscount: { $first: "$couponCodeDiscount" },
          isCouponApplied: { $first: "$isCouponApplied" },
          expectedDeliveryDate: { $first: "$expectedDeliveryDate" },
          orderStatus: { $first: "$status" },
          paymentStatus: { $first: "$paymentStatus" },
          time: { $first: "$updatedAt" },
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
        ])
        return NextResponse.json({allOrders,success:true},{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({"err":error.name,success:false},{status:400})
    }
}