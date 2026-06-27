"use client";
import React, { useEffect, useState } from "react";
import apiClient from "../../context/apiInstance";
import { Loader2 } from "lucide-react";
import empty from "../../assets/empty-wishlist.png";
import Image from "next/image";
import WishlistCard from "../../../components/WishlistCard";

function page() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const getWishList = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/wishlist/get-wishlist`);
      if (res.data.success) setData(res.data.wishlist);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

    useEffect(()=>{
      getWishList()
    },[])

  return (
    <div className="min-h-screen pt-28 p-12">
      <h1 className="text-2xl font-bold">Your Wishlist</h1>
      {loading ? (
        <div className="min-h-40 flex justify-center items-center">
          <Loader2 className="size-4 animate-spin" />
        </div>
      ) : data && data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-12">
            {
                data.map((item)=>{
                    return (
                        <WishlistCard key={item._id} getWishlist={getWishList} item={item}/>
                    )
                })
            }
        </div>
      ) : (
        <div className="mt-12 flex flex-col gap-8 justify-center items-center">
          <Image
            alt="empty"
            src={empty}
            className="h-60 w-60"
            height={500}
            width={500}
          />
          <p className="text-gray-500 font-semibold">
            OOPS, You have got an empty Wishlist!
          </p>
        </div>
      )}
    </div>
  );
}

export default page;
