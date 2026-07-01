import { NextResponse } from "next/server";
import { checkToken } from "../../../../../lib/checkToken";
import Bag from "../../../../models/BagModel";
import mongoose from "mongoose";

export async function POST(req, {params}) {
  try {
    let userId = checkToken(req);
    let {itemId} = await params
    console.log(itemId,userId)
    if(!userId){
      return NextResponse.json({ "message":"You are not authorised.", success:false }, { status: 401 });
    }
    let bag = await Bag.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    bag.items = bag?.items?.filter((i)=>i._id.toString() !== itemId)
    bag.totalAmount = bag.items.reduce((total,item)=>total + item.price * item.quantity,0)
    await bag.save()
    
    return NextResponse.json({ "message":"Item removed from bag.",bag, success: true }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error, success: false }, { status: 400 });
  }
}
