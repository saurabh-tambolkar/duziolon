import ConnectDb from "../../../../../db/ConnectDb";
import { NextResponse } from "next/server";
import Ticket from "../../../../../models/TicketModel";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await ConnectDb();
    let { id } = await params;
    console.log(id);
    let tickets = await Ticket.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          localField: "orderId",
          foreignField: "_id",
          from: "orders",
          as: "order",
        },
      },
      {
        $unwind: "$order",
      },
      {
        $lookup: {
          localField: "userId",
          foreignField: "_id",
          from: "users",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $group: {
          _id: "$_id",
          subject:{$first:"$subject"},
          description:{$first:"$description"},
          status:{$first:"$status"},
          createdAt:{$first:"$createdAt"},
          user:{
            $first:{
                name:"$user.name",
                email:"$user.email",
                phone:"$user.phone",
                id:"$user._id"
            }
          },
          order: {
            $first: {
              orderId: "$order._id",
              status: "$order.status",
              paymentStatus: "$order.paymentStatus",
              totalAmount: "$order.amount",
              totalAmountPaid: "$order.amountPaid",
              couponCode: "$order.couponCode",
              couponCodeDiscount: "$order.couponCodeDiscount",
              isCouponApplied: "$order.isCouponApplied",
              expectedDeliveryDate: "$order.expectedDeliveryDate",
              time: "$order.updatedAt",
            },
          },
        },
      },
    ]);

    return NextResponse.json(
      { ticketDetails: tickets[0], success: true },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
