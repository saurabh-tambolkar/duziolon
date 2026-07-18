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


// import React from 'react'
// import MainImg from "../../assets/mainImage.png"
// import Image from 'next/image'

// function page() {

//   let data = 
//         {
//             "_id": "6a5b66ffc99c1d4ad578ce09",
//             "userId": "6a3c33acdee2fa77c150e4f3",
//             "totalAmount": 1294,
//             "totalAmountPaid": 1294,
//             "couponCode": "",
//             "couponCodeDiscount": 0,
//             "isCouponApplied": false,
//             "expectedDeliveryDate": "2026-07-25T11:44:15.280Z",
//             "deliveryDate": "2026-07-18T11:44:51.182Z",
//             "orderStatus": "DELIVERED",
//             "paymentStatus": "PAYMENT_SUCCESS",
//             "time": "2026-07-18T11:44:51.183Z",
//             "address": {
//                 "flat": "C3 902",
//                 "street": "The lake district",
//                 "landmark": "Kondhwa",
//                 "city": "Pune",
//                 "taluqa": "haveli",
//                 "district": "Pune",
//                 "state": "Maharashtra",
//                 "country": "India",
//                 "postalCode": "411044"
//             },
//             "items": [
//                 {
//                     "productId": "6a3d0f88dee2fa77c150e580",
//                     "variantId": "6a3d1d7bdee2fa77c150e70d",
//                     "size": "M",
//                     "price": "599",
//                     "quantity": 1,
//                     "_id": "6a5b66e6c99c1d4ad578cdf9",
//                     "product": {
//                         "_id": "6a3d0f88dee2fa77c150e580",
//                         "name": "Duziolon full Sleeve t-shirt",
//                         "gender": "mens",
//                         "description": "Men's Full Sleeve Soild Casual Regular Fit T-Shirt ",
//                         "color": "Purple",
//                         "image": {
//                             "url": "https://m.media-amazon.com/images/I/61jRJPf75-L._SY741_.jpg"
//                         }
//                     }
//                 },
//                 {
//                     "productId": "6a3e7a55e9b1196295c30f4e",
//                     "variantId": "6a3e7a66e9b1196295c30f55",
//                     "size": "M",
//                     "price": "695",
//                     "quantity": 1,
//                     "_id": "6a5b66edc99c1d4ad578ce02",
//                     "product": {
//                         "_id": "6a3e7a55e9b1196295c30f4e",
//                         "name": "Duziolon Men’s Cargo Pants",
//                         "gender": "mens",
//                         "description": "DBAX Men’s Cargo Pants | Relaxed Fit Multi Pocket Cargo Trousers for Men | Casual Solid Black Utility Pants with Elastic Waist (in, Alpha, Regular)",
//                         "color": "Black",
//                         "image": {
//                             "url": "https://m.media-amazon.com/images/I/41EKVc60ClL.jpg"
//                         }
//                     }
//                 }
//             ]
//         }

//   return (
//     <div className='pt-30 mx-18'>
//       <div className='flex justify-between'>
//       <div className='w-1/3 flex items-center'>
//       <Image src={MainImg} alt="img" width={200} height={200} className="h-50 w-50 object-center"/>
//       <div>
//       <h1 className='font-extrabold text-4xl mb-12'>DUZIOLON</h1>
//       <h1 className='font-bold text-xl'>INVOICE</h1>
//       <p>Thank you for shopping with us</p>
//       </div>
//       </div>
//       <div className='w-1/3 rounded px-6 py-2 border shadow flex flex-col justify-between gap-2'>
//         <div className='flex justify-between'>
//           <h2 className='text-gray-800 font-semibold'>Invoice Number</h2>
//           <h2 className='font-bold'>48574858458478</h2>
//         </div>
//         <div className='flex justify-between'>
//           <h2 className='text-gray-800 font-semibold'>Order Id</h2>
//           <h2 className='font-bold'>48574858458478</h2>
//         </div>
//         <div className='flex justify-between'>
//           <h2 className='text-gray-800 font-semibold'>Invoice Date</h2>
//           <h2 className='font-bold'>18th July 2026</h2>
//         </div>
//         <div className='flex justify-between'>
//           <h2 className='text-gray-800 font-semibold'>Payment Method</h2>
//           <h2 className='font-bold'>Phonepe</h2>
//         </div>
//         <div className='flex justify-between'>
//           <h2 className='text-gray-800 font-semibold'>Payment Status</h2>
//           <h2 className='font-bold text-green-500'>Paid</h2>
//         </div>
//       </div>
//       </div>
//        <div className='bg-white shadow-sm border p-2 rounded-lg mt-6 gap-4 grid grid-cols-1 md:grid-cols-3'>
//           <div className='px-8'>
//           <h1 className='font-bold text-lg mb-2'>Delivery Address</h1>
//           <h4 className='text-neutral-500 font-semibold text-sm'>{data?.address?.flat} {data?.address?.street}, {data?.address?.landmark}</h4>
//           <h4 className='text-neutral-500 font-semibold text-sm'>{data?.address?.city} {data?.address?.taluqa} {data?.address?.district}</h4>
//           <h4 className='text-neutral-500 font-semibold text-sm'>{data?.address?.postalCode}</h4>
//           </div>
//           <div className='px-8'>
//           <h1 className='font-bold text-lg mb-2'>Shipping Address</h1>
//           <h4 className='text-neutral-500 font-semibold text-sm'>{data?.address?.flat} {data?.address?.street}, {data?.address?.landmark}</h4>
//           <h4 className='text-neutral-500 font-semibold text-sm'>{data?.address?.city} {data?.address?.taluqa} {data?.address?.district}</h4>
//           <h4 className='text-neutral-500 font-semibold text-sm'>{data?.address?.postalCode}</h4>

//           </div>
//           </div>
//          <table className="w-full mt-8 border-collapse">
//   <thead>
//     <tr className="bg-gray-100 border-b">
//       <th className="text-left p-3">Product</th>
//       <th className="text-center p-3">Size</th>
//       <th className="text-center p-3">Qty</th>
//       <th className="text-right p-3">Price</th>
//       <th className="text-right p-3">Total</th>
//     </tr>
//   </thead>

//   <tbody>
//     {data.items.map((item) => (
//       <tr
//         key={item._id}
//         className="border-b hover:bg-gray-50"
//       >
//         {/* Product */}
//         <td className="p-4">
//           <div className="flex items-center gap-4">
//             <img
//               src={item.product.image.url}
//               alt={item.product.name}
//               className="w-16 h-16 object-cover rounded border"
//             />

//             <div>
//               <h3 className="font-semibold">
//                 {item.product.name}
//               </h3>

//               <p className="text-sm text-gray-500">
//                 {item.product.color}
//               </p>
//             </div>
//           </div>
//         </td>

//         {/* Size */}
//         <td className="text-center">
//           {item.size}
//         </td>

//         {/* Quantity */}
//         <td className="text-center">
//           {item.quantity}
//         </td>

//         {/* Price */}
//         <td className="text-right pr-4">
//           ₹{Number(item.price).toLocaleString()}
//         </td>

//         {/* Total */}
//         <td className="text-right pr-4 font-semibold">
//           ₹{(Number(item.price) * item.quantity).toLocaleString()}
//         </td>
//       </tr>
//     ))}
//   </tbody>
// </table>
// <div className='flex items-center justify-between w-full gap-8 mt-12'>
//   <div className='shadow px-6 py-4 border rounded w-1/2'>
//     <h1 className='text-xl font-bold mb-6'>ORDER SUMMARY</h1>
//       <div className='flex justify-between'>
//           <h2 className='text-gray-800 font-semibold'>Subtotal</h2>
//           <h2 className='font-bold'>{data.totalAmount}</h2>
//         </div>
//       <div className='flex justify-between'>
//           <h2 className='text-gray-800 font-semibold'>Discount</h2>
//           <h2 className='font-bold'>{data.couponCodeDiscount}</h2>
//         </div>
//         <hr className='my-4'/>
//       <div className='flex justify-between'>
//           <h2 className='text-gray-800 text-lg font-bold'>Grand Total</h2>
//            <h2 className='text-2xl font-extrabold'>{data.totalAmountPaid}</h2>
//         </div>
//   </div>
//   <div className='w-1/2 flex flex-col justify-between items-start gap-4'>
//    <h1 className='text-lg font-bold'>Need Help ?</h1>
//    <h6 className='text-sm text-gray-700 font-semibold'>If you have any issue with the purchase you can contact our support team.</h6>
//    <h4 className='text-2xl font-bold'>THANK YOU!</h4>
//    <h5 className='text-md font-semibold'>We appreciate your purchase.</h5>
//   </div>
// </div>
//     </div>
//   )
// }

// export default page