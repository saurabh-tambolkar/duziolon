import { NextResponse } from "next/server";
import ConnectDb from "../../../db/ConnectDb";
import Categories from "../../../models/CategoriesModel";

export async function POST(req,res){
    try {
        await ConnectDb();
        let payload = await req.json();
        let {category} = payload;
        console.log(category)
        let existingCategory = await Categories.findOne({category});
        console.log(existingCategory)
        if(existingCategory){
            return NextResponse.json({message:"Category already exits with this name",success:false},{status:400})
        }
        else{
            let newCategory = new Categories({category});
            await newCategory.save();
            return NextResponse.json({message:"Category created successfully.",success:true},{status:201})
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({message:"Cannot create new Category right now.",success:true},{status:400})
    }
}