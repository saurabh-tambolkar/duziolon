import { NextResponse } from "next/server";
import { checkToken } from "../../../../lib/checkToken";
import Bag from "../../../models/BagModel";
import mongoose from "mongoose";

export async function POST(req, res) {
  try {
    let payload = await req.json();
    let {userId} = payload
    console.log("u",userId);
    let bag = await Bag.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
    ]);
    let length = bag[0]?.items.length || 0

    return NextResponse.json({ numOfItemsIsBag:length, success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error, success: false }, { status: 400 });
  }
}
