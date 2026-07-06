import React from 'react'
import menCard from "../app/assets/menCardImage.png"
import womenCard from "../app/assets/womenCardImage.png"
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

function CategoryCard() {

    const data = [
        {
            name:"Men's Clothing",
            image:menCard,
            link:"/products/mens"
        },
        {
            name:"Women's Clothing",
            image:womenCard,
            link:"/products/womens"
        }
    ]

  return (
    <div className='pt-16 px-4 md:px-28'>
        <h1 className='text-3xl font-bold text-center'>Shop By Category</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-12 mt-4'>
            {
                data && data.map((item)=>{
                    return(
                        <div key={item.name} className='mt-4 flex items-center border rounded-md w-full'>
                            <div className= ' w-1/2 rounded-lg gap-6 pl-12 flex flex-col'>
                                <h3 className='text-black text-2xl font-bold'>{item.name}</h3>
                                <Link href={item.link} className='text-black text-sm font-semibold flex items-center gap-3'>Shop Now <ArrowRight className='size-4'/></Link>
                            </div>
                            <Image src={item.image} alt={item.name} width={200} height={240} className='w-full md:w-full h-40 md:h-60 object-contain rounded-lg'/>
                        </div>
                    )
                })
            }
        </div>
    </div>
  )
}

export default CategoryCard