"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  IndianRupee,
  CheckCircle2,
  Clock3,
  XCircle,
  Dot,
  MapPin,
  MoveRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";


export function formatDate(dateString) {
    const date = new Date(dateString);

    const day = date.getDate();

    const getSuffix = (day) => {
      if (day > 3 && day < 21) return "th";

      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${getSuffix(day)} ${date.toLocaleString("en-US", {
      month: "long",
    })} ${date.getFullYear()}`;
  }

function OrderItem({ item }) {
  const [open, setOpen] = useState(false);

  const saved =
    Number(item.totalAmount || 0) - Number(item.totalAmountPaid || 0);

  const getStatusColor = () => {
    switch (item.orderStatus) {
      case "SUCCESS":
        return "text-green-700 bg-green-50 border-green-200";
      case "FAILED":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
    }
  };

  const getStatusIcon = () => {
    switch (item.orderStatus) {
      case "SUCCESS":
        return <CheckCircle2 className="w-4 h-4" />;
      case "FAILED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock3 className="w-4 h-4" />;
    }
  };


  

  return (
    <div className="mt-8 overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all shadow duration-300 hover:shadow-lg">
      {/* ---------------- Header ---------------- */}

      <div className="flex md:flex-col gap-5 md:flex-row items-center md:justify-between px-4 py-4">
        <Image
          src={item.items[0].product.image.url}
          width={140}
          height={170}
          alt={"image"}
          className="rounded-2xl border object-contain w-40 h-50"
        />
        <div className="w-full flex flex-col justify-end items-center gap-2 md:gap-12">
        <div className=" w-full flex flex-col md:flex-row justify-between items-start">
          <div>
          <h2 className="text-md md:text-lg font-semibold tracking-wide text-neutral-900">
            Order #{item._id.slice(-8).toUpperCase()}
          </h2>

          <div className="flex flex-row md:flex-col items-baseline md:flex-row gap-4 md:items-baseline">
            <p className="mt-2 text-xs font-semibold text-neutral-500">
              {/* {item.time.split("T")[0]}
               */}
              Order placed on {formatDate(item.time)}
            </p>
            {/* <span className="w-2 h-2 rounded-full bg-gray-400"></span>
            <span className="text-xs text-gray-600 font-medium">
              {item.items.length} Item{item.items.length > 1 ? "s" : ""}
            </span> */}
          </div>
          </div>
        <div className="flex-row md:flex-col justify-between  items-center gap-4 ">
          <h2 className="text-sm font-semibold">Status</h2>
          <span
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ${getStatusColor()}`}
          >
            {getStatusIcon()}
            {item.orderStatus}
          </span>
        </div>
        <div className="flex-col justify-between  items-center gap-4 ">
          <h2>Total</h2>
          <h3 className="mt-2 flex items-center text-xl font-semibold">
              <IndianRupee className="mr-1 h-4 w-4" />
              {item.totalAmount}
            </h3>
        </div>
        </div>
        <div className="w-full flex flex-col md:flex-row justify-between items-center">
          <div className="hidden md:block relative">
          <h2 className="text-sm inline-block font-bold tracking-wide text-neutral-900">
  {item.items[0].product.name}
</h2>
<span className="text-neutral-500 text-sm font-semibold cursor-pointer" onMouseOver={()=>setOpen(true)} onMouseOut={()=>setOpen(false)} >
  {item.items.length > 1 && ` + ${item.items.length - 1} more`}
</span>
{
  open && <div className="rounded bg-white shadow border p-2 absolute -top-20 -right-20">
    {
      item.items.slice(1).map((item)=>{
        return(
          <div key={item._id}>
            <Image
          src={item.product.image.url}
          width={140}
          height={170}
          alt={"image"}
          className="rounded-2xl border object-contain w-20 h-20"
        />
            {/* <p >{item.product.name}</p> */}
          </div>
        )
      })
    }
  </div>
}
          <div className="hidden md:flex items-baseline gap-2 justify-baseline">
            <p className="mt-2 text-xs font-bold text-neutral-500">
              {item.items[0].product.color}
            </p>
            <span className="w-2 h-2 rounded block bg-neutral-500"> </span>
            <p className="mt-2 text-xs font-bold text-neutral-500">
              {item.items[0].size}
            </p>
            <span className="w-2 h-2 rounded block bg-neutral-500"> </span>
            <p className="mt-2 text-xs font-bold text-neutral-500">
              Qty: {item.items[0].quantity}
            </p>
          </div>
          </div>
        <div className="hidden md:flex flex-col justify-between  items-center gap-4 ">
          <h2 className="text-sm font-semibold">Delivered On</h2>
          <span
          >
           Pending
          </span>
        </div>
        <div className="flex-col justify-between  items-center gap-4 ">
          <Link href={`/orders/${item._id}`}>
              <Button>View Order <MoveRight/></Button>
          </Link>
        </div>
        </div>
        </div>

      </div>
    </div>
  );
}

export default React.memo(OrderItem);
