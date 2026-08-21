import { NextResponse } from "next/server";
import ConnectDb from "../../db/ConnectDb";
import UserModel from "../../models/UserModel";

export async function GET(req) {
  try {
    await ConnectDb();

    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("query")?.trim() || "";

    let users;

    if (query) {
      users = await UserModel.aggregate([
        {
          $match: {
            $or: [
              {
                name: {
                  $regex: query,
                  $options: "i",
                },
              },
              {
                email: {
                  $regex: query,
                  $options: "i",
                },
              },
            ],
          },
        },
        {
          $project: {
            password: 0,
            verifyCode: 0,
            verifyCodeExpiry: 0,
          },
        },
      ]);
    } else {
      users = await UserModel.aggregate([
        {
          $project: {
            password: 0,
            verifyCode: 0,
            verifyCodeExpiry: 0,
          },
        },
      ]);
    }

    return NextResponse.json(
      {
        message: "Users fetched successfully",
        users,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Can't get users list now",
        success: false,
      },
      { status: 400 }
    );
  }
}