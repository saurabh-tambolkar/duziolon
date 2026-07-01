import { NextRequest, NextResponse } from "next/server";
import sha256 from "crypto-js/sha256";
import axios from "axios";
import { checkToken } from "../../../../../lib/checkToken";
import Bag from "../../../../models/BagModel";
import Order from "../../../../models/OrderModel";
import ConnectDb from "../../../../db/ConnectDb";
 
export async function POST(req){
    try {
         await ConnectDb();
        const { id} = await req.json();
        // console.log("Status API called", id, Date.now());
        // console.log("saurabh",id)
        let isOrderPresentWithTransId = await Order.findOne({transactionId:id})
        // console.log("hello",isOrderPresentWithTransId)
        if(!isOrderPresentWithTransId){
            let userId = checkToken(req);
            const merchantId = process.env.PHONEPE_MERCHANT_ID;
            const transactionId = id;
            const st = `/pg/v1/status/${merchantId}/${transactionId}` + process.env.PHONEPE_SALT_KEY;
            const dataSha256 = sha256(st).toString();
            const checksum = dataSha256 + "###" + process.env.PHONEPE_SALT_INDEX;
            console.log(checksum);
     
            const options = {
                method: "GET",
                url: `${process.env.PHONEPE_PHONE_PAY_HOST_URL}/pg/v1/status/${merchantId}/${transactionId}`,
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                    "X-VERIFY": checksum,
                    "X-MERCHANT-ID": `${merchantId}`,
                },
            };
     
            const response = await axios.request(options);
     
            if (response.data.code === "PAYMENT_SUCCESS") {     
                
                let bag = await Bag.findOne({userId});
    
                if(!bag){
                    return NextResponse.json({
                        "message":"No bag found",
                        success:false
                    }, { status: 404 });
                }
                else{
                    let newOrder = new Order({
                        userId,
                        transactionId,
                        status:response.data.code,
                        items:bag.items,
                        amount:Number(response.data.data.amount)/100 || bag.totalAmount
                    })
                    await newOrder.save();
                    await Bag.findByIdAndDelete({_id:bag._id})
                    return NextResponse.json({
                        status: response.data.code,
                        userId,
                        transactionId: response.data.data.transactionId,
                        newOrder,
                        "message":"Your transaction was successfull.",
                        success:true
                    }, { status: 200 });
                }
    
            } else {
                return NextResponse.json({
                    status: "FAIL",
                    success:false,
                    "message":"Something went wrong,contact the website owner",
                    referenceId: null,
                }, { status: 400 });
            }
        }
        else{
            return NextResponse.json({
                "message":"Order already placed.",
                success:false
            }, {status: 400});
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