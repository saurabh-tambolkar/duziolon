import { NextResponse } from "next/server";
import Coupon from "../../../models/CouponsModel";

export async function POST(req, res) {
  try {
    let payload = await req.json()
    let {couponId} = payload

    let coupon = await Coupon.findOneAndDelete({_id:couponId})
    if(coupon){
        return NextResponse.json({"message":`Coupon deleted successfully`,success:true},{status:201})
    }
    else{
        return NextResponse.json({"message":`Coupon can't be deleted successfully`,success:false},{status:400})
    }

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error, success: false }, { status: 400 });
  }
}
