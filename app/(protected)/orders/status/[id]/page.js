"use client";

import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { apiClient } from "../../../../context/apiInstance";
import { useUser } from "../../../../context/AuthContext";

export default function OrderPlacedPage() {
  // const orderId = "ORD-87456321";
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  let {getBagItemsLength,couponDetails} = useUser()
  console.log(couponDetails)

  let { id } = useParams();

  const hasFetched = useRef(false);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.post("/order/payments/status", {
        id: id,
      });
      if (response.data.success) {
        setStatus(response.data);
        getBagItemsLength()
      }
    } catch (error) {
      const errorMessage = error
        ? error.response?.data?.message || error.message
        : "Something went wrong. Please contact the website owner.";
      console.log(error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // useEffect(()=>{
  //   if(error == "Order already placed."){
  //     router.replace("/orders")
  //   }
  // },[error])

  useEffect(() => {
    if (!id || hasFetched.current) return;

    hasFetched.current = true;
    fetchStatus();
  }, [id, fetchStatus]);

  return (
    <div className="min-h-screen pt-24  flex items-center justify-center p-5">
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : error ? (
        <p className="font-bold text-red-500 text-lg">{error}</p>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="w-full max-w-lg bg-white rounded-2xl shadow-md border p-8"
        >
          {/* Success Icon */}
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 10,
                duration: 2,
              }}
              className="bg-green-100 rounded-full p-5"
            >
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </motion.div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-center mt-6">Order Placed!</h1>

          <p className="text-gray-500 text-center mt-3">
            Thank you for shopping with us.
            <br />
            Your order has been placed successfully.
          </p>

          {/* Order Details */}
          <div className="mt-8 bg-gray-100 rounded-xl p-5 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Order ID</span>
              <span className="font-semibold">{status?.isOrderPresentWithTransId?._id}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Payment</span>
              <span className="text-green-600 font-semibold">Successful</span>
            </div>

            {/* <div className="flex justify-between">
            <span className="text-gray-500">Estimated Delivery</span>
            <span className="font-semibold">3 - 5 Days</span>
          </div> */}
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3">
            <Link href="/orders">
              <button className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition">
                <ShoppingBag size={18} />
                View Orders
              </button>
            </Link>

            <Link href="/">
              <button className="w-full flex items-center justify-center gap-2 border py-3 rounded-xl hover:bg-gray-100 transition">
                Continue Shopping
                <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
