import { NextResponse } from "next/server";
import ConnectDb from "../../../db/ConnectDb";
import Categories from "../../../models/CategoriesModel";

export async function GET(req,res){
    try {
        await ConnectDb();
        console.log("hello")
        let categories = await Categories.aggregate([
            {
                $match:{isActive:true}
            }
        ])
        return NextResponse.json({message:"Categories fetched successfuly.",categories,success:true},{status:200})
    } catch (error) {
        return NextResponse.json({message:"Cannot get Categories right now.",success:false},{status:400})
    }
}