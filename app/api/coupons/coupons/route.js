import { NextResponse } from "next/server";
import Coupon from "../../../models/CouponsModel";
import ConnectDb from "../../../db/ConnectDb";

export async function GET(req, res) {
  try {
     await ConnectDb();
    let coupons = await Coupon.find()
    return NextResponse.json({"message":"Coupons fetched successfully",coupons,success:true},{status:201})

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error, success: false }, { status: 400 });
  }
}
