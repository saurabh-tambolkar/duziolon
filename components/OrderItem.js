import {
    ChevronDown,
  ChevronUp,
  DeleteIcon,
  IndianRupee,
  Loader2Icon,
  MinusSquare,
  PlusSquare,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import apiClient from "../app/context/apiInstance";
import { useUser } from "@/app/context/AuthContext";

function OrderItem({ item, getBagItems }) {
  const [open, setOpen] = useState(false);

  let { setBagLength } = useUser();

  const deleteBagItem = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setLoading(true);
      const res = await apiClient.post(`/bag/delete-item/${item._id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        getBagItems();
        setBagLength((prev) => (prev = prev - 1));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 justify-start bg-gray-100 w-full items-center rounded-md border shadow-md gap-8">
      <div className="flex justify-between  w-full">
        <h1 className="text-md font-bold">Order ID: {item._id}</h1>
        {
            open
            ?
            <ChevronUp onClick={()=>setOpen(false)}/>
            :
            <ChevronDown  onClick={()=>setOpen(true)}/>
        }
      </div>
      {
        open && 
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3">
        {item.items.map((item) => {
          return (
            <div key={item._id} className="flex gap-8 items-center p-4 bg-gray-200 rounded-md border">
              <Image
                src={item?.product?.image?.url}
                className="h-auto w-30 object-contain rounded-lg"
                width={400}
                height={400}
                alt="image"
              />
              <div>
                <h1 className="font-bold mb-4">{item?.product?.name}</h1>
                <h2 className="font-semibold">Size: {item?.size}</h2>
                <h2 className="font-semibold flex gap-2 items-center">
                  Color:{" "}
                  <div
                    className={`w-5 h-5 rounded-full border`}
                    style={{ backgroundColor: item.product.color }}
                  ></div>
                </h2>
                <h2 className="font-semibold">Quantity: {item?.quantity}</h2>
                <div className="flex mt-4">
                  <IndianRupee className="size-4" />
                  <h2 className="font-semibold text-md">
                    {item?.price || "Not added yet!"}
                  </h2>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      }
      <div className="mt-4 flex justify-between items-end">
        <h1 className="text-md font-semibold">Status: Delivered</h1>
        <h1 className="text-lg font-bold">Total: {item?.totalAmount}</h1>
      </div>
    </div>
  );
}

export default React.memo(OrderItem);
