import { NextResponse } from "next/server";
import ConnectDb from "../../../db/ConnectDb";
import Categories from "../../../models/CategoriesModel";

export async function POST(req,res){
    try {
        await ConnectDb();
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