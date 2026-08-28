"use client";
import React, { useEffect, useState } from "react";
import CardItem from "./CardItem";
import { Input } from "./ui/input";
import { Loader2, Search, X } from "lucide-react";
import useDebounce from "@/app/hooks/useDebounce";
import { useParams } from "next/navigation";
import apiClient from "@/app/context/apiInstance";

function ProductSearchPage({ data,gender }) {
  const [products, setProducts] = useState(data);
  let {category} = useParams()
//   console.log("params",params)

  const [searchQuery, setSearchQuery] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const searchProducts = async () => {
    if (!debouncedSearchQuery.trim()) {
      setProducts(data);
      return;
    }

    try {
        setIsFetching(true)
      const res = await apiClient.get(`/product/search-product/${gender}/${category}?query=${encodeURIComponent(
          debouncedSearchQuery,
        )}`,
      );

      if (res.data.success) {
        setProducts(res.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setProducts([]);
    }
    finally{
        setIsFetching(false)
    }
  };


  useEffect(() => {
    // if (!searchQuery) return;
    // console.log("hello", debouncedSearchQuery);
    searchProducts()
  }, [debouncedSearchQuery,category]);

  return (
    <>
      <div className="w-full md:w-1/3 mt-4 md:my-12 relative">
        <Input
          placeholder="Search"
          name="query"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute top-2 left-3 size-5 text-gray-500" />
        {
            isFetching && debouncedSearchQuery ?
            <Loader2 className="animate-spin absolute top-2 right-3 size-5 text-gray-500" />
            :
            debouncedSearchQuery && !isFetching
            ?
            <X className="absolute top-2 right-3 size-5 text-gray-500" onClick={()=>{setSearchQuery("")}}/>
            : null

        }

      </div>
      {products?.products?.length == 0 && (
        <p className="text-center mt-40">No products found!</p>
      )}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-8">
        {products.products?.map((item) => (
          <CardItem key={item._id} product={item} />
        ))}
      </div>
    </>
  );
}

export default ProductSearchPage;
