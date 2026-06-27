import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "../../../models/UserModel";    
import connectDB from "../../../db/ConnectDb";          // <-- your DB connect function

export async function GET(req, { params }) {
  try {
    await connectDB();

    // Next.js 15 requires await
    const { token } = await params;
    // console.log("Token:", token);

    if (!token) {
      return NextResponse.json(
        { message: "Token not provided", success: false },
        { status: 400 }
      );
    }

    const jwtSecretKey = process.env.JWTSECRETKEY;

    let decoded;
    try {
      // This throws an error if token is expired or invalid
      decoded = jwt.verify(token, jwtSecretKey);
      // console.log(decoded);
    } catch (err) {
      return NextResponse.json(
        { message: "Invalid or expired token", success: false },
        { status: 401 }
      );
    }

    // Your express used: decoded.user.id  
    const userId = decoded.user.id;

    const verifiedUser = await User.findById(userId).lean();
    // console.log("verifiedUser",verifiedUser)
    if (!verifiedUser) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // Generate a new access token (same as Express)
    const data = {
      user: { id: userId },
    };
    const accessToken = jwt.sign(data, jwtSecretKey, {
      expiresIn: "24h",
    });

    const userDetails = {
      _id: verifiedUser._id,
      email: verifiedUser.email,
      name: verifiedUser.name,
      role: verifiedUser.role,
      mobileNumber: verifiedUser.mobileNumber,
      profileImage: verifiedUser.profileImage,
    };

    return NextResponse.json(
      {
        message: "Token verified successfully",
        accessToken,
        userDetails,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { message: "Server error", success: false },
      { status: 500 }
    );
  }
}
