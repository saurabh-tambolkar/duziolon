import { NextResponse } from "next/server";
import ConnectDb from "../../../db/ConnectDb";
import Ticket from "../../../models/TicketModel";
import { checkToken } from "../../../../lib/checkToken";

export async function POST(req,res){
    try{
        await ConnectDb();
        let userId = checkToken(req);
        const payload = await req.json();
        let { orderId, subject, description } = payload;

        let newTicket = new Ticket({
            userId,
            orderId,
            subject,
            description,
        })
        await newTicket.save();
        return NextResponse.json(
            {
                message: "Ticket raised successfully",
                success: true,
            },
            { status: 200 },
        );
    }
    catch(error){
        console.log(error)
        return NextResponse.json(
            {
                message: "Error in raising ticket",
                success: false,
            },
            { status: 500 },
        );
    }
}