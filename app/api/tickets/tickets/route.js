import ConnectDb from "../../../db/ConnectDb";
import {checkToken} from "../../../../lib/checkToken";
import { NextResponse } from "next/server";
import Ticket from "../../../models/TicketModel";

export async function GET(req,res){
    try{
        await ConnectDb();
        let userId = checkToken(req)
        if(!userId){
            return NextResponse.json({message:"Unauthorized"},{status:401})
        }
        let tickets = await Ticket.find({userId}).sort({createdAt:-1})
        return NextResponse.json({tickets,success:true},{status:200})
    }catch(err){
        return NextResponse.json({message:err.message},{status:500})
    }
}