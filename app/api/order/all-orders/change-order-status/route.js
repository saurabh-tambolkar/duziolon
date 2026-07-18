import { NextResponse } from "next/server";
import ConnectDb from "../../../../db/ConnectDb"
import Order from "../../../../models/OrderModel";

export async function POST(req){
    try {
        await ConnectDb()
        let payload =  await req.json()
        let {
            orderStatus,
            id
        } = payload;
        console.log(payload)
         const futureDate = new Date();
            const isoString = futureDate.toISOString();
        let updatedOrder = await Order.findByIdAndUpdate({_id:id},{status:orderStatus,deliveryDate:orderStatus == "DELIVERED" ? isoString : null},{runValidators: true,new:true})
        return NextResponse.json({"message":"Status Updated successfully",success:true,updatedOrder},{status:200})
    } catch (error) {
        return NextResponse.json({error,success:false},{status:400})
    }
}