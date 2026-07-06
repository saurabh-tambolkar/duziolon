import { NextResponse } from "next/server";
import { checkToken } from "../../../../../lib/checkToken";
import ConnectDb from "../../../../db/ConnectDb";
import AddressModel from "../../../../models/AddressModal";

export async function POST(req, { params }) {
  try {
    const { id } = await params;

    const userId = checkToken(req);

    if (!userId) {
      return NextResponse.json(
        {
          message: "You are unauthorized",
          success: false,
        },
        { status: 401 }
      );
    }

    await ConnectDb();

    const isAddressPresent = await AddressModel.findOne({
      _id: id,
      userId,
    });

    if (!isAddressPresent) {
      return NextResponse.json(
        {
          message: "No address found",
          success: false,
        },
        { status: 404 }
      );
    }

    const {
      flat,
      street,
      city,
      taluqa,
      district,
      state,
      postalCode,
      landmark,
    } = await req.json();

    await AddressModel.findByIdAndUpdate(
      id,
      {
        flat,
        street,
        city,
        taluqa,
        district,
        state,
        landmark,
        postalCode,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return NextResponse.json(
      {
        message: "Address updated successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Can't update address right now",
        success: false,
      },
      { status: 500 }
    );
  }
}