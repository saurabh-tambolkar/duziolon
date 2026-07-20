'use client'
import { IndianRupee, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import apiClient from '../../../context/apiInstance';
import {formatDate, getStatusColor, getStatusIcon} from "../../../../components/OrderItem"
import Image from 'next/image';
import { Button } from '../../../../components/ui/button';
import bag from "../../../assets/mainImage.png"

function page({params}) {

    let {orderId} = useParams();

    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)

    const getOrderDetails = async()=>{
      try {
        setLoading(true)
        const res = await apiClient.get(`/order/orders/${orderId}`);
              if (res.data.success) {
                console.log(res.data.orderDetails)
                setData(res.data.orderDetails[0])
              };
      } catch (error) {
        console.log(error)
      }
      finally{
        setLoading(false)
      }
    }

    useEffect(()=>{
      getOrderDetails()
    },[])


  return (
    <div className="min-h-screen pt-30 mx-auto w-11/12 md:w-10/12 ">
      {
        loading ?
        <Loader2 className='text-center animate-spin mt-24 mx-auto'/>
        :
        <>
         <h1 className='text-2xl text-black font-bold'>Order Details</h1>
        <div className='bg-white shadow-sm border p-4 rounded-lg mt-6 flex justify-between items-baseline'>
          <div>
          <h1 className='font-bold text-md'>Order ID: #{data?._id?.slice(-8).toUpperCase()}</h1>
          <h1 className='font-semibold text-sm text-neutral-500 my-2'>Placed On: {formatDate(data?.time)}</h1>
          <h1 className='font-semibold text-sm text-neutral-500 my-2'>{data?.orderStatus =="DELIVERED"  ? "Delivered On" : "Expected Delivery" }:  {data?.orderStatus == "DELIVERED" ? formatDate(data?.deliveryDate) : formatDate(data?.expectedDeliveryDate) } </h1>
          </div>
         <span
                     className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ${getStatusColor(data?.orderStatus)}`}
                   >
                     {getStatusIcon(data?.orderStatus)}
                     {data?.orderStatus}
                   </span>
        </div>
        <div className='bg-white shadow-sm border p-2 rounded-lg mt-6 gap-4 grid grid-cols-1 md:grid-cols-3'>
          <div className='px-8'>
          <h1 className='font-bold text-lg mb-2'>Delivery Address</h1>
          <h4 className='text-neutral-500 font-semibold text-sm'>{data?.address?.flat} {data?.address?.street}, {data?.address?.landmark}</h4>
          <h4 className='text-neutral-500 font-semibold text-sm'>{data?.address?.city} {data?.address?.taluqa} {data?.address?.district}</h4>
          <h4 className='text-neutral-500 font-semibold text-sm'>{data?.address?.postalCode}</h4>
          </div>
          <div className='px-8'>
          <h1 className='font-bold text-lg mb-2'>Shipping Address</h1>
          <h4 className='text-neutral-500 font-semibold text-sm'>{data?.address?.flat} {data?.address?.street}, {data?.address?.landmark}</h4>
          <h4 className='text-neutral-500 font-semibold text-sm'>{data?.address?.city} {data?.address?.taluqa} {data?.address?.district}</h4>
          <h4 className='text-neutral-500 font-semibold text-sm'>{data?.address?.postalCode}</h4>

          </div>
          <div className='px-8'>
          <h1 className='font-bold text-lg mb-2'>Order Summary</h1>
          <div className='flex justify-between items-center mb-1'>
            <h3 className='text-sm font-semibold'>Items</h3>
            <h3 className='flex items-center font-semibold text-sm'><IndianRupee className='size-4'/>{data?.totalAmount}</h3>
          </div>
          <div className='flex justify-between items-center mb-1'>
            <h3 className='text-sm font-semibold text-green-600'>Discount</h3>
            <h3 className='flex items-center text-sm font-semibold text-green-600'>{data?.couponCodeDiscount}%</h3>
          </div>
          <hr className='my-2'/>
          <div className='flex justify-between items-center mb-1'>
            <h3 className='text-sm font-bold'>Total Paid</h3>
            <h3 className='flex items-center text-md font-bold'><IndianRupee className='size-4'/>{data?.totalAmountPaid}</h3>
          </div>
          </div>
         
        </div>
        <div className='bg-white shadow-sm border p-2 rounded-lg mt-6 gap-4 px-4'>
          <h1 className='font-bold text-lg mb-2'>Item{data?.items?.length > 1 && "s"} in the Order</h1>
          {
            data?.items?.map((item,index)=>{
              return(
                <div key={index} className='m-0 md:m-4 flex gap-2 md:gap-8 items-center'>
                  <div className='rounded-lg border shadow-sm w-40 flex justify-center items-center'>
                  <Image alt="image" src={item?.product?.image?.url} width={100} height={200} className="rounded h-30 w-20 object-contain"/>
                  </div>
                  <div className='w-full gap-4'>
                    <div className='flex justify-between'>
                    <h2 className='text-md font-bold w-2/3 truncate'>{item?.product?.name}</h2>
                    <h2 className='text-md font-bold flex '><IndianRupee className='size-4'/>{item?.price}</h2>
                    </div>
                    <div className='flex justify-between mt-2'>
                      <div className='flex gap-4 '>
                    <h2 className='text-sm text-gray-600 font-bold'>Color: {item?.product?.color}</h2>
                    <h2 className='text-sm text-gray-600 font-bold'> Size: {item?.size}</h2>

                      </div>
                    <h2 className='text-sm font-bold flex '>Qty: {item?.quantity}</h2>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
         <div className='bg-white shadow-sm border p-2 md:p-4 rounded-lg mt-6 gap-4 grid grid-cols-1 items-center md:grid-cols-3'>
          <div className='px-4 md:px-8'>
          <h1 className='font-bold text-lg mb-2'>Need Help?</h1>
          <h4 className='text-neutral-500 font-semibold text-sm'>If you have any issue with the order.</h4>
          <h4 className='text-neutral-500 font-semibold text-sm'>You can raise a request</h4>
          <Button className=' mt-1 md:mt-4 border-1 shadow w-full bg-white text-black font-bold hover:bg-gray-200'>Raise a Request</Button>
          </div>
          <div className='px-4 md:px-8'>
          <h1 className='font-bold text-lg mb-2'>View Invoice</h1>
          <h4 className='text-neutral-500 font-semibold text-sm'>Download your Order Invoice</h4>
          <h4 className='text-neutral-500 font-semibold text-sm'>for this purchase</h4>
          <Button className='mt-1 md:mt-4 border-1 w-full shadow bg-white text-black font-bold hover:bg-gray-200' onClick={()=>{
window.open(
`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/invoice/${data._id}`
)
}}>Download Invoice</Button>
          </div>
          <div className='hidden md:block mx-auto'>
         <Image src={bag} alt={"invoice"} width={200} height={240} className='h-30  object-contain rounded-lg'/>
                        
          </div>
         </div>
        </>
      }
    </div>
  )
}

export default page
