import Ticket from "@/app/models/TicketModel";
import User from "@/app/models/UserModel";
import { NextResponse } from "next/server";
import {publishKafkaEvent} from "../../../../../lib/kafkaevents"

export async function PUT(req, { params }) {
  try {
    let { id } = await params;
    console.log(id);
    let ticket = await Ticket.findOne({ _id: id });
    ticket.status = "closed";
    console.log(ticket);
    let user = await User.findOne({_id:ticket.userId})
    console.log(user.name)
    await ticket.save()
    await publishKafkaEvent({
      topic: "ticket-resolved",
      event: "TICKET_RESOLVED",
      key: ticket._id,
      data: {
        ticketId: String(ticket._id),
        orderId: String(ticket.orderId),
        userId: String(ticket.userId),
        name: user.name,
        email: user.email,
      },
    });
    return NextResponse.json(
      { message: "Ticket resolved successfully", ticket, success: true },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "Cant resolve ticket right now,contact Admin.",
        success: false,
      },
      { status: 400 },
    );
  }
}