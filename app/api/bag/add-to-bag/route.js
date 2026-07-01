import { NextResponse } from "next/server";
import { checkToken } from "../../../../lib/checkToken";
import Bag from "../../../models/BagModel";
import Size from "../../../models/SizeModel";

export async function POST(req, res) {
  try {
    let userId = checkToken(req);
    let payload = await req.json();
    let { productId, size, variantId, quantity } = payload;
    console.log(productId, size, variantId, quantity);

    let bag = await Bag.findOne({ userId });
    console.log("bag", bag);

    let sizeProd = await Size.findOne({variantId:variantId})
    if(!sizeProd){
      return NextResponse.json({ "message":"No size contains for provided variant", success: false }, { status: 400 });
    }

    if (!bag || bag == null) {
      let newBag = new Bag({
        userId,
        items: [
          {
            productId,
            variantId,
            size,
            price:sizeProd.price,
            quantity: quantity || 1,
          },
        ],
        totalAmount: Number(sizeProd.price) * Number(quantity || 1),
      });
      await newBag.save();
      return NextResponse.json(
        { msg: "Added to bag successfully", success: true },
        { status: 200 },
      );
    } else {
        console.log("hello old bag",bag)
      bag.items.push({
        productId,
        variantId,
        size,
        price:sizeProd.price,
        quantity: quantity || 1,
      });
      bag.totalAmount =  Number(bag.totalAmount) + Number(sizeProd.price) * Number(quantity || 1);
      await bag.save();
      return NextResponse.json(
        {
          msg: "Added to bag successfully",
          success: true,
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error, success: false }, { status: 400 });
  }
}
