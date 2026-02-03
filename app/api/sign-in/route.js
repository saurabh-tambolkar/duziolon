import { NextResponse } from "next/server";
import ConnectDb from "../../db/ConnectDb";
import User from "../../models/UserModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"


export async function POST(req,res) {
    await ConnectDb();
    try {
        let payload = await req.json();
        let {email,password} = payload;
        console.log(email,password)
        let jwtSecretKey = process.env.JWTSECRETKEY;
        let existingUser = await User.findOne({email})
        if(!existingUser){
            return NextResponse.json({message:"User not found",success:false},{status:400})
        }else{
            if(!existingUser.isVerified){
                return NextResponse.json({message:"User is not verified, Verify firstly to signin.",success:false},{status:400})
            }
            let samePass = await bcrypt.compare(password,existingUser.password)
            if(!samePass){
                return NextResponse.json({message:"Credentials are incorrect",success:false},{status:400})
            }
            let data = {
                user:{
                    id:existingUser.id
                }
            }
            let accessToken = jwt.sign(data,jwtSecretKey,{expiresIn:"24h"})
            let refreshToken = jwt.sign(data,jwtSecretKey,{expiresIn:"7d"})
            let userDetails = {
                id:existingUser.id,
                name:existingUser.name,
                email:existingUser.email,
                phone:existingUser.phone,
                role:existingUser.role,
            }

            return NextResponse.json({message:"Login successfull",userDetails,accessToken,refreshToken,success:true},{status:200})
        }
    } catch (error) {
        return NextResponse.json({message:"Unable to login right now",success:false},{status:400})
    }
}