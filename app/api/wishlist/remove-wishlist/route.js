import { NextResponse } from "next/server";
import Wishlist from "../../../models/WishlistModel";
import { checkToken } from "../../../../lib/checkToken";
import ConnectDb from "../../../db/ConnectDb";

export async function DELETE(req,res){
    await ConnectDb()
    try {
        let payload = await req.json();
        let userId = checkToken(req)
        if(!userId){
            return NextResponse.json({"message":"You are unauthorised",success:false},{status:401})
        }
        let {productId} = payload
        let deltedWishlistItem = await Wishlist.findOneAndDelete({"productId":productId,"userId":userId})
        return NextResponse.json({"message":"Successfully removed wishlisted item",success:true,deltedWishlistItem},{status:200})
    } catch (error) {
        console.log(error)
         return NextResponse.json({error,success:false},{status:400})
    }
} 