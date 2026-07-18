import { NextResponse } from "next/server";
import ConnectDb from "../../../../db/ConnectDb";
import Order from "../../../../models/OrderModel";
import InvoicePDF from "../../../../../components/InvoiceTemplate";
import { pdf } from "@react-pdf/renderer";
import React from "react";
import mongoose from "mongoose";

export async function GET(req, { params }) {

    await ConnectDb();

    let {id} = await params;

    const order = await Order.aggregate([
        {
            $match:{_id:new mongoose.Types.ObjectId(id)}
        },
        {
            $unwind:"$items"
        },
        {
            $lookup:{
                from:'products',
                localField:"items.productId",
                foreignField:"_id",
                as:"prod"
            }
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
    ]);
    if (order.length == 0 ) {
      return Response.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    console.log(order)

const instance = pdf(
  React.createElement(InvoicePDF, { data:order[0] })
);

const blob = await instance.toBlob();

    return new Response(blob, {

      headers: {

        "Content-Type": "application/pdf",

        "Content-Disposition":
          `attachment; filename=Duziolon_Invoice-${order[0]._id}.pdf`,

      },

    });

}