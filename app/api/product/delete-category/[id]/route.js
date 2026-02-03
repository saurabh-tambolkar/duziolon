import { NextResponse } from "next/server";
import Categories from "../../../../models/CategoriesModel";

export async function POST(req,{params}){
    try {
        let {id} = await params;
        console.log(id)
        let existinngCategory = await Categories.findOne({_id:id})
        if(!existinngCategory){
            return NextResponse.json({message:"Category not found",success:false},{status:404});
        }
        let deletedCategory = await Categories.findByIdAndDelete({_id:id});
        return NextResponse.json({message:"Category deleted successfully ",deletedCategory,success:true},{status:200});
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"Cant delete category right now.",success:false},{status:400});
    }
}