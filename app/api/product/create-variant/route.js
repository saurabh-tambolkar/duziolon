import { NextResponse } from "next/server";
import Variant from "../../../models/VariantModel";
import ConnectDb from "../../../db/ConnectDb";

export async function POST(req,res){
    try {
        await ConnectDb();
        let payload = await req.json();
        let {color,productId} = payload;
        console.log(color,productId)
        let newVariantToSave = new Variant({
            color,
            productId
        })
        await newVariantToSave.save();
        return NextResponse.json({message:"Variant added successfully",success:true},{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"Cant add Variant right now",success:false},{status:400})
    }
}