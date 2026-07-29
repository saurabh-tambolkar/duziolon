import mongoose from "mongoose";
import { NextResponse } from "next/server";
import dns from "dns"
dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

let ConnectDb=async()=>{
    if(mongoose.connection.readyState >= 1){
        return NextResponse.json({message:"Database is already connected to the App."})
    }else{
        try {
            await mongoose.connect(process.env.MONOGO_URI);
            console.log("DB Connected")
            return NextResponse.json({message:"Database connected successfully"})
        } catch (error) {
            console.log("Db connection error: ",error)
            process.exit(1);
        }
    }
}

export default ConnectDb