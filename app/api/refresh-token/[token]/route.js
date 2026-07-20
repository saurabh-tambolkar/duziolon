import { NextResponse } from "next/server";
import ConnectDb from "../../../db/ConnectDb";
import jwt from "jsonwebtoken";
import User from "../../../models/UserModel";

export async function GET(req, { params }) {
  try {
    await ConnectDb();
    let { token } = await params;

    if (!token) {
      return NextResponse.json(
        { message: "No token provided", success: false },
        { status: 400 }
      );
    }

    const jwtSecretKey = process.env.JWTSECRETKEY;
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecretKey);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token", success: false },
        { status: 401 }
      );
    }
    let id = decoded.user.id;
    const verifiedUser = await User.findById(id);
    if (!verifiedUser) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }
     const data = {
          user: { id: id },
        };
        const accessToken = jwt.sign(data, jwtSecretKey, {
          expiresIn: "24h",
        });
    
        const userDetails = {
          _id: verifiedUser._id,
          email: verifiedUser.email,
          mobileNumber: verifiedUser.mobileNumber,
          profileImage: verifiedUser.profileImage,
        };
    
        return NextResponse.json(
          {
            message: "Token has been refreshed successfully",
            accessToken,
            userDetails,
            success: true,
          },
          { status: 200 }
        );
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Cant refresh token now", success: false },
      { status: 400 }
    );
  }
}
