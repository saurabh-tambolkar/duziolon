import { NextResponse } from "next/server";
import ConnectDb from "../../../db/ConnectDb";
import Product from "../../../models/ProductModel";

export async function POST(req,res){
    try {
        await ConnectDb();
        let payload = await req.json();
        let {name,category,description,gender} = payload;
        console.log(name)
        let newProductToSave = new Product({
            name,
            description,
            category,
            gender,
        })
        await newProductToSave.save();
        return NextResponse.json({message:"Product added successfully",newProductToSave,success:true},{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"Cant add product right now",error,success:false},{status:400})
    }
}