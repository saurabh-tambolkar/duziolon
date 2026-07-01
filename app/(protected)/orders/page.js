"use client";
import React, { useCallback, useEffect, useState } from "react";
import apiClient from "../../context/apiInstance";
import { CrossIcon, IndianRupee, Loader2, MoveRightIcon, Tags, X } from "lucide-react";
import emptyBag from "../../assets/empty-orders.png";
import Image from "next/image";
import BagItemCard from "../../../components/BagItemCard";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OrderSummary from "@/components/OrderSummary"
import { useRouter } from "next/navigation";
import OrderItem from "../../../components/OrderItem";

function page() {

 
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const router = useRouter()

  const getOrders = async () => {
    try {
      setLoading(true);
      const res = await apiClient.post(`/order/orders`);
      if (res.data.success) {
        console.log(res.data.orders)
        setData(res.data.orders)
      };
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }



 



    useEffect(()=>{
      getOrders()
    },[])

  return (
    <div className="min-h-screen pt-28 p-4 md:p-12 md:pt-24">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {loading ? (
        <div className="min-h-40 flex justify-center items-center">
          <Loader2 className="size-4 animate-spin" />
        </div>
      ) : data && data?.length > 0 ? (
        <div className="mt-4 md:ml-24 md:mr-24">
        
        <div className="w-full">
          <div>
            {
                data?.map((item)=>{
                    return (
                        <OrderItem key={item._id} item={item} getBagItems={getOrders}/>
                    )
                })
            }
        </div>
        </div>
        </div>
      ) : (
        <div className="mt-12 flex flex-col gap-8 justify-center items-center">
          <Image
            alt="empty-bag"
            src={emptyBag}
            className="h-100 w-90"
            height={500}
            width={500}
          />
        </div>
      )}
    </div>
  );
}

export default page;