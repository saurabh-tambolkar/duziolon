import { NextResponse } from "next/server";
import ConnectDb from "../../db/ConnectDb";
import User from "@/app/models/UserModel";

export async function POST(req, res) {
  await ConnectDb();
  try {
    let payload = await req.json();
    let { email, verifyCode } = payload;
    let existingUser = await User.findOne({email});
    if (!existingUser) {
      return NextResponse.json(
        { message: "No user was found with this email.", success: false },
        { status: 400 }
      );
    } else {
        let isCodeValid = existingUser.verifyCode == verifyCode;
        let isCodeNotExpired = new Date(existingUser.verifyCodeExpiry) > new Date();
        console.log(existingUser,existingUser.verifyCodeExpiry.toISOString(),isCodeNotExpired)

      if (isCodeValid && isCodeNotExpired) {
        existingUser.isVerified = true;
        await existingUser.save();
        return NextResponse.json({
          message: "Account has been verified successfully",
          success: 204,
        });
      } else if (!isCodeNotExpired) {
        return NextResponse.json({
          message: "Code is expired , please signup to get new code.",
          success: false,
        });
      } else {
        return NextResponse.json({
          message: "Code is invalid , please signup to get new code.",
          success: false,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "User was not verified successfully", success: false },
      { status: 400 }
    );
  }
}
