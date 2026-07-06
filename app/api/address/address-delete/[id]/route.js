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

    const isAddressPresent = await AddressModel.findByIdAndDelete({
      _id: id,
    });

    return NextResponse.json(
      {
        message: "Address deleted successfully",
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