import ConnectDb from "../../../db/ConnectDb";
import {checkToken} from "../../../../lib/checkToken";
import { NextResponse } from "next/server";
import Ticket from "../../../models/TicketModel";

export async function GET(req,res){
    try{
        await ConnectDb();
        let tickets = await Ticket.aggregate([
            {
                $match:{}
            },
            {
                $lookup:{
                    from:"users",
                    localField:"userId",
                    foreignField:"_id",
                    as:"user"
                }
            },
             {
                $unwind:"$user"
            },
            {
        $project: {
          _id: 1,
          userId: 1,
          orderId: 1,
          subject: 1,
          description: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,

          "user.name": 1,
          "user.email": 1,
          "user.phone": 1,
        },
      },
        ])
        return NextResponse.json({tickets,success:true},{status:200})
    }catch(err){
        return NextResponse.json({message:err.message},{status:500})
    }
}