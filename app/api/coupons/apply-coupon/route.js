import { NextResponse } from "next/server";
import Coupon from "../../../models/CouponsModel";

export async function POST(req, res) {
  try {
    let payload = await req.json()
    let {name} = payload

    let coupon = await Coupon.findOne({name:name})

    if(!coupon){
        return NextResponse.json({"message":"Invalid coupon code entered.",success:true},{status:200})
    }
    let date = coupon.expiryDate
    let dateOfCouponInUnix = Date.parse(date)
    let dateNow = Date.now()
    if(dateOfCouponInUnix < dateNow){
      return NextResponse.json({"message":`Coupon has been expired.`,success:true},{status:200})
    }
    return NextResponse.json({"message":`Coupon applied successfully and discount of ${coupon.discount}% is added.`,discount:coupon.discount,success:true},{status:201})

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error, success: false }, { status: 400 });
  }
}
