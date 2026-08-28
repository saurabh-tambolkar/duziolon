import ConnectDb from "@/app/db/ConnectDb";
import User from "@/app/models/UserModel";
import { NextResponse } from "next/server";

export async function PUT(req, res) {
  try {
    await ConnectDb();
    let payload = await req.json();
    let { email, phone, name } = payload;
    console.log(email, name, phone);
    let user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "No user found", success: false },
        { status: 404 },
      );
    }
    ((user.name = name), (user.phone = phone));
    await user.save();
    let userDetails= {
        name:user.name,
        phone:user.phone,
    }
    return NextResponse.json(
      { message: "Profile updated successfully", userDetails, success: true },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Cant update profile right now", success: false },
      { status: 400 },
    );
  }
}
