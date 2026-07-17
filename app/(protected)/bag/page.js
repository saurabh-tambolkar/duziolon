"use client";
import React, { useCallback, useEffect, useState } from "react";
import apiClient from "../../context/apiInstance";
import { CrossIcon, IndianRupee, Loader2, MoveRightIcon, Tags, X } from "lucide-react";
import emptyBag from "../../assets/empty-bag.png";
import Image from "next/image";
import BagItemCard from "../../../components/BagItemCard";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OrderSummary from "@/components/OrderSummary"
import { useRouter } from "next/navigation";

function page() {

 
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const router = useRouter()

  const getShoppingBag = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.post(`/bag/get-bag`);
      if (res.data.success) {setData(res.data.bag);};
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  },[]) 



 



    useEffect(()=>{
      getShoppingBag()
    },[])

  return (
    <div className="min-h-screen pt-28 p-4 md:p-12 md:pt-24">
      <h1 className="text-2xl font-bold">Your Shopping Bag</h1>
      {loading ? (
        <div className="min-h-40 flex justify-center items-center">
          <Loader2 className="size-4 animate-spin" />
        </div>
      ) : data && data?.items?.length > 0 ? (
        <div className="mt-4 md:ml-24 md:mr-24 grid grid-cols-1 items-start justify-center md:grid-cols-3">
        
        <div className="col-span-2">
          <div>
            {
                data?.items?.map((item)=>{
                    return (
                        <BagItemCard key={item._id} item={item} getBagItems={getShoppingBag}/>
                    )
                })
            }
        </div>
        </div>
        <OrderSummary data={data}/>
        </div>
      ) : (
        <div className="mt-12 flex flex-col gap-8 justify-center items-center">
          <Image
            alt="empty-bag"
            src={emptyBag}
            className="h-100 w-100"
            height={500}
            width={500}
          />
        </div>
      )}
    </div>
  );
}

export default page;
{/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12">
            {
                data?.items?.map((item)=>{
                    return (
                        <WishlistCard key={item._id} item={item}/>
                    )
                })
            }
        </div> */}