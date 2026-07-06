import { NextResponse } from "next/server";
import AddressModel from "../../../models/AddressModal";
import { checkToken } from "../../../../lib/checkToken";
import ConnectDb from "../../../db/ConnectDb";

export async function POST(req,res){
    try {
        let userId = checkToken(req);
        if(!userId){
            return NextResponse.json({ "message":"you are unauthorised", success: false }, { status: 401 });
        }
        else{
            await ConnectDb();
            let addresses = await AddressModel.find({userId})
            return NextResponse.json({
                "message":"Address fetched successfully",
                addresses,
                success:true
            }, { status: 200 });
        }
    } catch (error) {
        console.log("error",error)
        return NextResponse.json({
            message: "Cant fetch addresses right now",
            error
        }, {status: 500});
    }
}