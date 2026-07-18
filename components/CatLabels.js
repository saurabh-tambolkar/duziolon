'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useRef } from 'react'

function CatLabels({categories}) {

    let {gender,category} = useParams()
    categories = [{"category":"All",_id:"all"},...categories,]

     const activeRef = useRef(null)

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center", // or "nearest"
        block: "nearest",
      })
    }
  }, [category])

  return (
     <div className='w-full md:w-auto flex overflow-x-scroll md:overflow-hidden whitespace-nowrap scrollbar-hide py-2 mt-2 md:mt-0'>
        {
          categories && categories.map((item)=>{
            return(
              <Link   ref={category === item._id ? activeRef : null} key={item._id} className={`text-sm w-auto gap-2 px-2 rounded-full py-1 mx-2 ${category == item._id ? "bg-black rounded-full text-white" : "bg-gray-200 text-black rounded"}`} href={`/products/${gender}/${item._id}`}>{item.category}</Link>
            )
          })
        }
      </div>
  )
}

export default CatLabels