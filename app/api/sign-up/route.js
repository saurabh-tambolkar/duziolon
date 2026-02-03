import { NextResponse } from "next/server";
import ConnectDb from "../../db/ConnectDb";
import User from "@/app/models/UserModel";
import bcrypt from 'bcryptjs'

export async function POST(req,res){
    await ConnectDb();
    try {
        console.log("connected")
        let payload = await req.json();
        let {name,email,password,phone} = payload;
        let existingUser = await User.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString();
        // console.log(verifyCode)
        if(existingUser){
            return NextResponse.json({message:"User with this email alredy exist.",success:true},{status:400})
        }
        else{
            let salt = await bcrypt.genSalt(10);
            let hashedPassword = await bcrypt.hash(password,salt)
            const expiryDate = new Date();
            console.log(verifyCode,expiryDate)
            expiryDate.setHours(expiryDate.getHours() + 1);
            let newUser = new User({
                name,
                email,
                phone,
                verifyCode:verifyCode,
                password:hashedPassword,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
            })
            await newUser.save();
            return NextResponse.json({message:"User registered successfully , please verify your email.",name,email,verifyCode,expiryDate,success:true},{status:201})
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"Sign Up was not successfull, Try again later.",success:false},{status:400})
    }
}