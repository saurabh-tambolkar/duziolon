import { NextResponse } from "next/server";
import ConnectDb from "../../../db/ConnectDb";
import Image from "../../../models/ImagesModel";

export async function POST(req,res){
    try {
        await ConnectDb();
        let payload = await req.json();
        let {url,variantId,productId} = payload;
        console.log(url,variantId,productId)
        let newImageToSave = new Image({
            url,
            productId,
            variantId
        })
        await newImageToSave.save();
        return NextResponse.json({message:"Image added successfully",success:true},{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"Cant add image right now",success:false},{status:400})
    }
}