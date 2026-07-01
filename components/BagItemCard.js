import { DeleteIcon, IndianRupee, Loader2Icon, MinusSquare, PlusSquare, Trash2Icon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'sonner';
import apiClient from '../app/context/apiInstance';
import { useUser } from '@/app/context/AuthContext';

function BagItemCard({item,getBagItems}) {
    const [loading, setLoading] = useState(false);

    let {setBagLength} = useUser()
    
      const deleteBagItem = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        try {
          setLoading(true);
          const res = await apiClient.post(`/bag/delete-item/${item._id}`);
          if (res.data.success){
            toast.success(res.data.message)
            getBagItems()
            setBagLength((prev)=>prev=prev-1)
          };
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

  return (
    <Link href={`/products/${item.product?.gender}/${item.productId}`} className=' flex mb-2 justify-start items-center rounded-md border shadow-md gap-8'>
        <Image alt='image' src={item.product?.image?.url} height={200} width={200} className="w-60 h-40 md:h-40 md:w-100 object-contain"/>
        <div className='p-2 w-full'>
            <div className='flex justify-between w-full items-center mb-4'>
                <div>
            <h1 className="font-bold text-md">Duziolon</h1>
             <h2 className="font-semibold text-sm">{item?.product.name}</h2>
                </div>
                {
                    loading ?
                    <Loader2Icon className='animate-spin size-4'/>
                    :
                    <Trash2Icon onClick={deleteBagItem} className='text-red-500 mr-2'/>
                }
            </div>
            <h2 className='font-semibold'>Size: {item?.size}</h2>
            <h2 className='font-semibold flex gap-2 items-center'>Color: <div
                  className={`w-5 h-5 rounded-full border`}
                  style={{ backgroundColor: item.product.color }}
                ></div></h2>
                <div className='flex flex-col md:flex-row md:justify-between md:items-center'>
            <h2 className='font-semibold'>Quantity: {item?.quantity}</h2>
            {/* <div className='flex items-center'>
                <MinusSquare className='text-gray-600 size-5'/>
            <h2 className='font-semibold pr-4 pl-4'>{item?.quantity}</h2>
                <PlusSquare className='text-gray-600 size-5'/>
            </div> */}

                </div>
             <div className="flex mt-4"> 
        <IndianRupee className="size-4" />
      <h2 className="font-semibold text-md">{item?.product?.price || "Not added yet!"}</h2>
      </div>
        </div>
        </Link>
  )
}

export default React.memo(BagItemCard)