import { NextResponse } from "next/server"
import ConnectDb from "../../../db/ConnectDb"
import Wishlist from "../../../models/WishlistModel"
import { checkToken } from "../../../../lib/checkToken";

export async function POST(req,res){
    await ConnectDb()
    try {
        let payload = await req.json();
        let userId = checkToken(req)
        if(!userId){
            return NextResponse.json({"message":"You are unauthorised",success:false},{status:401})
        }
        let {productId} = payload;
        console.log(payload)
        let newWishlistItem = new Wishlist({
            userId,
            productId
        })
        await newWishlistItem.save()
        return NextResponse.json({"msg":'Product added to Wishlist successfully',productId,success:true},{status:201})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error,success:false},{status:400})
    }
}