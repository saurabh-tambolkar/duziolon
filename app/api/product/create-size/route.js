import { NextResponse } from "next/server";
import ConnectDb from "../../../db/ConnectDb";
import Size from "../../../models/SizeModel";

export async function POST(req,res){
    try {
        await ConnectDb();
        let payload = await req.json();
        let {size,price,stock,productId,variantId} = payload;
        console.log(size,price,stock,productId,variantId)
        let newSizeToSave = new Size({
            size,price,stock,productId,variantId
        })
        await newSizeToSave.save();
        return NextResponse.json({message:"Size added successfully",newSizeToSave,success:true},{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"Cant add Size right now",success:false},{status:400})
    }
}