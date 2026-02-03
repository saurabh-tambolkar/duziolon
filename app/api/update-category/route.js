import { NextResponse } from "next/server";
import Categories from "../../models/CategoriesModel";

export async function POST(req,res){
    try {
        let payload = await req.json();
        let {id,category,isActive} = payload;
        console.log(id,category)
        let existinngCategory = await Categories.findOne({_id:id})
                if(!existinngCategory){
                    return NextResponse.json({message:"Category not found",success:false},{status:404});
                }
                let updatedCategory = await Categories.findByIdAndUpdate({_id:id},{category,isActive},{new:true});
                return NextResponse.json({message:"Category updated successfully ",updatedCategory,success:true},{status:200});
    } catch (error) {
        console.error("Server Error:", error);
            return NextResponse.json(
              { message: "Server error: Cant update category right now.", success: false },
              { status: 500 }
            );
    }
}