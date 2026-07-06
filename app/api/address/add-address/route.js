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
            const addressCount = await AddressModel.countDocuments({ userId });
            const { flat,street, city,taluqa,district, state, postalCode,landmark } = await req.json();
            let newAddress = new AddressModel({
                userId,
                flat,
                street,
                city,
                taluqa,
                district,
                landmark,
                state,
                country: "India",
                postalCode,
                isDefault: addressCount === 0 ? true : false
            })
            await newAddress.save();
            return NextResponse.json({
                "message":"Address added successfully",
                success:true
            }, { status: 200 });
        }
    } catch (error) {
        console.log("error",error)
        return NextResponse.json({
            message: "Cant add address right now",
            error
        }, {status: 500});
    }
}