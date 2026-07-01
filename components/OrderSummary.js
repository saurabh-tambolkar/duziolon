'use client'
import { IndianRupee, Loader2, MoveRightIcon, Tags, X } from 'lucide-react';
import React, { useState } from 'react'
import {Separator} from "./ui/separator"
import {Input} from "./ui/input"
import {Button} from "./ui/button"
import apiClient from '@/app/context/apiInstance';
import { useRouter } from 'next/navigation';
import {initiatePayment} from "../lib/initiatePayment"

function OrderSummary({data}) {

     const [showCouponInput, setShowCouponInput] = useState(false);
      const [code, setCode] = useState("");
      const [result, setResult] = useState({});
      const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);


  const router = useRouter()

       const applyCoupon = async () => {
          try {
            setLoading(true);
            let values ={
              "name":code
            }
            const res = await apiClient.post(`/coupons/apply-coupon`,values);
            if (res.data.success){
              setResult({
                "couponName":code,
                "discount":res.data?.discount || null,
                "msg":res.data.message
              })
              if(res?.data.discount){
                calculateTotalAmount(data?.totalAmount,res?.data?.discount)
              }
            }
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
        };

          let calculateTotalAmount=(subtotal,discount = 0)=>{
    let discountAmount = (discount * subtotal)/100
    let finalDiscountAmount = subtotal - discountAmount 
    setTotalAmount(finalDiscountAmount)
    setResult((prev)=>({...prev,discountAmount}))
  }

    const handlePayment = async () => {
    try {
      setLoading(true);
      let result = await initiatePayment(totalAmount || data.totalAmount)
      console.log(result)
      router.push(result.redirectUrl)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  } 


  return (
   <div className="shadow-lg rounded-md p-4 w-auto border md:sticky md:top-20">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          <div className="flex justify-between mt-3 mb-3">
            <h3 className="text-gray-600 font-semibold">Subtotal </h3>
            <div className="flex items-center">
            <IndianRupee className="size-4"/>
            <h3 className="font-bold text-lg">{data.totalAmount}</h3>
            </div>
          </div>
          {
            result && result.discount && 
          <div className="flex justify-between mt-3 mb-3">
            <h3 className="text-gray-600 font-semibold">Coupon </h3>
            <div className="flex items-center">
            <h3 className="font-bold text-lg">{result?.couponName}</h3>
            </div>
          </div>
          }
          <div className="flex justify-between mt-3 mb-3">
            <h3 className="text-gray-600 font-semibold">Discount ({result?.discount || 0}%)</h3>
            <div className="flex items-center">
            <IndianRupee className="size-4 text-red-500"/>
            <h3 className="font-bold text-lg text-red-500">-{result?.discountAmount || 0}</h3>
            </div>
          </div>
          <Separator/>
          <div className="flex justify-between mt-3 mb-3">
            <h3 className="text-gray-600 font-semibold">Total</h3>
            <div className="flex items-center">
            <IndianRupee className="size-4"/>
            <h3 className="font-bold text-lg">{totalAmount || data.totalAmount || 0}</h3>
            </div>
          </div>
          {
            showCouponInput
            &&
            <>
            <div className="relative"> 
              <Input placeholder={"Enter Coupon code"} className="mt-8" name={code} value={code} onChange={(e)=>setCode(e.target.value)}/>
              {/* <X className="absolute right-2 top-2 text-gray-600 size-5" onClick={()=>{setShowCouponInput(false);setCode("")}}/> */}
            </div>
            <p className={`${result.discount ? "text-green-500" : "text-red-600"} font-bold text-xs p-2`}>{result?.msg}</p>
            </>
          }
          <div className="flex justify-between mt-3 items-center mb-3">
            <h3 className="text-gray-400 text-xs font-semibold ml-8 flex items-center gap-2"><Tags className="size-4"/> Apply Coupon</h3>
            <div className="flex items-center">
              {
                result && result.discount || result.msg
                ?
                <Button className="rounded-full text-xs pl-12 pr-12" onClick={()=>{setShowCouponInput(false);setResult({});setCode("");setTotalAmount(data.totalAmount)}}>Remove Coupon</Button>
                :
                showCouponInput
                ?
                <Button className="rounded-full text-xs pl-12 pr-12" disabled={loading} onClick={applyCoupon}>{
                  loading ? <Loader2 className="animate-spin"/> : "Submit"
                }</Button>
                :
                <Button className="rounded-full text-xs pl-12 pr-12" onClick={()=>setShowCouponInput(true)}>Apply</Button>
              }
            </div>
          </div>
          <Button className="w-full mt-8 gap-4 rounded-full" disabled={loading} onClick={handlePayment}>
            
            { loading
            ?
            <Loader2 className='animate-spin'/>
            :
            <>
            Go to Checkout
            <MoveRightIcon/>
            </>
             }
          </Button>
        </div>
  )
}

export default OrderSummary