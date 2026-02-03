import mongoose from "mongoose";
import { NextResponse } from "next/server";

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