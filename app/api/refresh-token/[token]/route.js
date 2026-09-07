import { NextResponse } from "next/server";
import ConnectDb from "../../../db/ConnectDb";
import jwt from "jsonwebtoken";
import User from "../../../models/UserModel";

export async function GET(req, { params }) {
  try {
    await ConnectDb();

    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        {
          message: "No refresh token provided",
          success: false,
        },
        { status: 400 }
      );
    }

    const refreshSecret = process.env.JWTSECRETKEY;

    if (!refreshSecret) {
      return NextResponse.json(
        {
          message: "Refresh token secret is not configured",
          success: false,
        },
        { status: 500 }
      );
    }

    let decoded;

    try {
      decoded = jwt.verify(token, refreshSecret);

      console.log("Decoded refresh token:", decoded);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return NextResponse.json(
          {
            message: "Refresh token has expired. Please login again.",
            success: false,
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          message: "Invalid refresh token",
          success: false,
        },
        { status: 401 }
      );
    }

    const id = decoded.user?.id;

    if (!id) {
      return NextResponse.json(
        {
          message: "Invalid refresh token payload",
          success: false,
        },
        { status: 401 }
      );
    }

    const verifiedUser = await User.findById(id);

    if (!verifiedUser) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      );
    }

    // Generate NEW access token
    const accessToken = jwt.sign(
      {
        user: {
          id: verifiedUser._id,
        },
      },
      process.env.JWTSECRETKEY,
      {
        expiresIn: "15m",
      }
    );

    const userDetails = {
      _id: verifiedUser._id,
      email: verifiedUser.email,
      phone: verifiedUser.phone,
      role: verifiedUser.role,
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
    console.error("Refresh token error:", error);

    return NextResponse.json(
      {
        message: "Can't refresh token now",
        success: false,
      },
      { status: 500 }
    );
  }
}