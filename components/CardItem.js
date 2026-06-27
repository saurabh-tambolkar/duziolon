import { IndianRupee } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

function CardItem({ product }) {

  return (
    <Link href={`/products/${product.gender}/${product._id}`} className="bg-white shadow-xl border-1 rounded-md">
      <Image
      alt="image"
        src={product?.image?.url}
        width={"200"}
        height={"200"}
        className="w-full rounded-t-md h-68 object-cover"
      />
      <div className="p-2">
      <div className="flex gap-2 mb-2">
        {product.colors.map((col,index) => (
            <div 
                  key={col._id} className={`${index == 0 && "rounded-full border-2 border-black"}`}>
                <div
                  className={`w-5 h-5 rounded-full border`}
                  style={{ backgroundColor: col.color }}
                ></div>
            </div>
        ))}
      </div>
      <div className="flex justify-between items-center">
      <h1 className="font-bold text-md">Duziolon</h1>
      <h6 className="font-semibold text-xs text-white bg-black rounded-2xl w-auto pr-2 pl-2" style={{fontSize:10}}>{product.category}</h6>
      </div>
      <h2 className="font-semibold text-sm">{product.name}</h2>
      <div className="flex mt-4 mb-4"> 
        <IndianRupee className="size-4" />
      <h2 className="font-semibold text-xl">{product.sizes[0]?.price || "Not added yet!"}</h2>
      </div>
      <h2 className="font-semibold text-sm flex gap-2">FREE delivery Tomorrow 8 am - 12 pm</h2>
      </div>
      {/* <Button className="w-full rounded-b-md bg-white text-black hover:bg-black hover:text-white">
        Add to Cart
      </Button> */}
    </Link>
  );
}

export default CardItem;
