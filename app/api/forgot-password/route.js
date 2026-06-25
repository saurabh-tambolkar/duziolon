import { NextResponse } from "next/server";
import ConnectDb from "../../db/ConnectDb";
import User from "../../models/UserModel";
import jwt from "jsonwebtoken"


export async function POST(req,res) {
     await ConnectDb();
    try {
        let payload = await req.json();
        let {email} = payload;
        console.log(email)

        let jwtSecretKey = process.env.JWTSECRETKEY

        let userExists = await User.findOne({email})
        if(!userExists){
            return NextResponse.json({message:"No user found with this email",success:false},{status:400})
        }else{
            let data = {
                userId:{
                    id:userExists.id
                }
            }
            let token = jwt.sign(data,jwtSecretKey,{expiresIn:"10m"})
            let url = `/reset-password/${token}`
            console.log(url)
            return NextResponse.json({message:"Reset password link has been sent to mail.",url,success:true},{status:200})
        }

    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"Unable to send forgot password link",success:false},{status:400});
    }
}