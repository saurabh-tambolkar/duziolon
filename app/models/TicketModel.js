import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    subject:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        enum: ["open", "in_progress", "closed"],
        default: "open",
    },
},{timestamps: true});

mongoose.models.Ticket && delete mongoose.models.Ticket;

let Ticket = mongoose.model("Ticket",ticketSchema)

export default Ticket