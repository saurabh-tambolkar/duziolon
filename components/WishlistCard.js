import { DeleteIcon, IndianRupee, Loader2Icon, Trash2Icon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'sonner';
import apiClient from '../app/context/apiInstance';

function WishlistCard({item,getWishlist}) {


    const [loading, setLoading] = useState(false);
    
      const deleteWishlistItem = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        try {
          setLoading(true);
          let data = {
            "productId":item.productId
          }
          const res = await apiClient.delete(`/wishlist/remove-wishlist`,{data});
          if (res.data.success){
            toast.success(res.data.message)
            getWishlist()
          };
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

  return (
    <Link href={`/products/${item.product.gender}/${item.productId}`} className=' rounded-md border shadow-xl'>
        <Image alt='image' src={item.product?.image?.url} height={200} width={200} className="w-full h-60 object-cover"/>
        <div className='p-2'>
            <div className='flex justify-between items-center'>
                <div>
            <h1 className="font-bold text-md">Duziolon</h1>
             <h2 className="font-semibold text-sm">{item?.product.name}</h2>
                </div>
                {
                    loading ?
                    <Loader2Icon className='animate-spin size-4'/>
                    :
                    <Trash2Icon onClick={deleteWishlistItem} className='text-red-500 mr-2'/>
                }
            </div>
             <div className="flex mt-4 mb-4"> 
        <IndianRupee className="size-4" />
      <h2 className="font-semibold text-xl">{item?.product.price?.price || "Not added yet!"}</h2>
      </div>
             <h4>Available in {item?.product?.sizes} sizes</h4>
        </div>
        </Link>
  )
}

export default WishlistCard