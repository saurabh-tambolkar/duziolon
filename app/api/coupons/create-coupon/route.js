import { NextResponse } from "next/server";
import Coupon from "../../../models/CouponsModel";

export async function POST(req, res) {
  try {
    let payload = await req.json()
    let {name,discount,expiryDate} = payload

    let coupon = await Coupon.findOne({name:name})

    if(coupon){
        return NextResponse.json({"message":"Coupon with same name already exists.",success:false},{status:400})
    }
    let newCoupon = new Coupon({
        name,
        discount,
        expiryDate
    })
    await newCoupon.save()
    return NextResponse.json({"message":"Coupon created successfully",success:true},{status:201})

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error, success: false }, { status: 400 });
  }
}
