import ConnectDb from "../../../../db/ConnectDb";
import {checkToken} from "../../../../../lib/checkToken";
import { NextResponse } from "next/server";
import Ticket from "../../../../models/TicketModel";
import User from "@/app/models/UserModel";

export async function GET(req,{params}){
    try{
        await ConnectDb();
        let userId = checkToken(req)
        let {id} = await params
        console.log(id)
        if(!userId){
            return NextResponse.json({message:"Unauthorized"},{status:401})
        }
        let tickets = await Ticket.findById({_id:id})
        let admin = await User.findOne({role:"Admin"})
        let details = {
            ...tickets.toObject(),
            adminId:admin._id
        }
        return NextResponse.json({ticketDetails:details,success:true},{status:200})
    }catch(err){
        return NextResponse.json({message:err.message},{status:500})
    }
}