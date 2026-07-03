import { NextRequest, NextResponse } from "next/server";
import ConnectDb from "../../../db/ConnectDb";
import { checkToken } from "../../../../lib/checkToken";
import Order from "../../../models/OrderModel";
 
export async function POST(req){
    try {
        await ConnectDb();
        let userId = checkToken(req);
        const { id,isCouponApplied,couponCode,couponCodeDiscount,amount } = await req.json();
        console.log( id,isCouponApplied,couponCode,couponCodeDiscount,amount,userId )
        let isOrderPresentWithTransId = await Order.findOne({transactionId:id})
        if(isOrderPresentWithTransId){
            return NextResponse.json({
                "message":"Order already placed.",
                success:false
            }, { status: 400 });
        }
        else{
            let newOrder = new Order({
                userId,
                transactionId:id,
                isCouponApplied,
                couponCode : isCouponApplied ? couponCode : "",
                couponCodeDiscount : isCouponApplied ? couponCodeDiscount : 0,
                amount:amount
            })
            await newOrder.save();
            return NextResponse.json({
                "message":"Order Created Successfully, Complete the transaction to place the order.",
                success:true
            }, { status: 200 });
        }
    } catch (error) {
        console.error("Error in payment status check:", error);
        return NextResponse.json({
            status: "SERVER ERROR",
            referenceId: null,
            error
        }, {status: 500});

    }
}