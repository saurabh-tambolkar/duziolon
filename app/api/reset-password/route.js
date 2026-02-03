import { NextResponse } from "next/server";
import ConnectDb from "../../db/ConnectDb";
import jwt from "jsonwebtoken"
import { success } from "zod";
import User from "../../models/UserModel";
import bcrypt from "bcryptjs";
import { isAwaitKeyword } from "typescript";

export async function POST(req,res){
    await ConnectDb();
    try {
        let payload = await req.json();
        let {password,token} = payload;
        console.log(password,token);

        let jwtSecretKey = process.env.JWTSECRETKEY

      const decoded = jwt.verify(token, jwtSecretKey);
    const userId = decoded.userId.id;

    let userExists = await User.findOne({_id:userId})
    if(!userExists){
        return NextResponse.json({message:"User not found with this token",success:false},{status:400})
    }
    let salt = await bcrypt.genSalt(10);
    let hashedPass = await bcrypt.hash(password,salt)
    let updatedUser = await User.findByIdAndUpdate(
        userId,
        {password:hashedPass},
        {new:true}
    )

    return NextResponse.json({message:"Password has been reseted successfully. ",success:true},{status:200})

    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"Unable to Reset Password right now.",success:false},{status:400})
    }
}