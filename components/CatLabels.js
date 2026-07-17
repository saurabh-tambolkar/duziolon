'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'

function CatLabels({categories}) {

    let {gender,category} = useParams()
    categories = [{"category":"All",_id:"all"},...categories,]

  return (
     <div>
        {
          categories && categories.map((item)=>{
            return(
              <Link key={item._id} className={`text-sm gap-2 px-2 rounded-full py-1 mx-2 ${category == item._id ? "bg-black rounded-full text-white" : "bg-gray-200 text-black rounded"}`} href={`/products/${gender}/${item._id}`}>{item.category}</Link>
            )
          })
        }
      </div>
  )
}

export default CatLabels