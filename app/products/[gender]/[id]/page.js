"use client";
import axios from "axios";
import { Heart, IndianRupee, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import apiClient from "../../../context/apiInstance";
import {useUser} from "../../../context/AuthContext"
import { toast } from "sonner";

export default function Page() {
  const { id } = useParams();
  const {currentUser,setBagLength} = useUser()
  const [data, setData] = useState();
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [wishlisting, setWishlisting] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const getDetailsOfProduct = async () => {
    try {
      setLoading(true);
      const res = await apiClient.post(`/product/get-product/${id}`);
      if (res.data.success) {
        setData(res.data.prodDetails[0]);
        setSelectedColor(res.data.prodDetails[0].variants[0]);
        setSelectedImage(res.data.prodDetails[0].variants[0].images[0].url);
        setSelectedSize(res.data.prodDetails[0].variants[0].sizes[0]);
        setWishlisted(res.data.prodDetails[0].isWishlisted);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  const wishlistProduct = async () => {
    try {
      setWishlisting(true);
      let values = {
        productId: id,
      };
      const res = await apiClient.post(`/wishlist/wishlist-product`, values);
      if (res.data.success) {
        setWishlisted(true)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setWishlisting(false);
    }
  };

  const addProductToBag = async () => {
    try {
      setAddingToCart(true);
      let values = {
        productId: id,
        variantId:selectedColor._id,
        size:selectedSize.size,
        quantity:1
      };
      const res = await apiClient.post(`/bag/add-to-bag`, values);
      if (res.data.success) {
        toast.success(res.data.msg);
        setAddedToCart(true)
        setBagLength((prev)=>prev=prev+1)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAddingToCart(false);
    }
  };

  useEffect(()=>{
    if(!addedToCart) return;
    let timer = setTimeout(()=>{
        setAddedToCart(false)
      },5000)
    
      return ()=>clearTimeout(timer)

  },[addedToCart])

  const removewishlistProduct = async () => {
    try {
      setWishlisting(true);
      let data = {
                 "productId":id
               }
               const res = await apiClient.delete(`/wishlist/remove-wishlist`,{data});
      if (res.data.success) {
        setWishlisted(false)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setWishlisting(false);
    }
  };

  useEffect(() => {
    getDetailsOfProduct();
  }, [id]);

  return (
    <>
      {loading ? (
        <div className="min-h-screen flex justify-center items-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <section className="text-gray-600 body-font overflow-hidden pt-12 min-h-screen flex justify-center items-center">
          <div className="container px-5 py-24 mx-auto">
            <div className="lg:w-4/5 mx-auto flex flex-wrap">
              <div className="w-full lg:w-1/2 flex flex-col md:flex-row gap-4">
                <div className="lg:w-1/4 flex flex-row md:flex-col gap-2 order-2 md:order-0">
                  {selectedColor &&
                    selectedColor?.images?.map((img) => {
                      return (
                        <Image
                          key={img._id}
                          onMouseOver={() => setSelectedImage(img.url)}
                          height={50}
                          width={50}
                          alt="ecommerce"
                          className={` ${selectedImage == img.url && "border-2 border-black"} w-1/4 md:w-full  md:h-20 h-20 object-contain object-center rounded border-1`}
                          src={img.url || null}
                        />
                      );
                    })}
                </div>
                {selectedImage && (
                  <Image
                    alt="ecommerce"
                    className=" w-1/2 md:w-1/4  lg:w-full md:h-100 h-80 object-contain object-center rounded"
                    height={500}
                    width={500}
                    src={selectedImage}
                  />
                )}
              </div>

              <div className="lg:w-1/2 justify-between flex flex-col w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                <div>
                  <h2 className="text-sm title-font text-gray-500 tracking-widest">
                    DUZIOLON
                  </h2>

                  <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                    {data?.name}
                  </h1>

                  {/* ⭐⭐⭐⭐⭐ Rating */}
                  <div className="flex mb-4">
                    <span className="flex items-center">
                      {[1, 2, 3, 4].map((i) => (
                        <svg
                          key={i}
                          fill="currentColor"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="w-4 h-4 text-indigo-500"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}

                      {/* Empty Star */}
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="w-4 h-4 text-indigo-500"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>

                      <span className="text-gray-600 ml-3">4 Reviews</span>
                    </span>
                  </div>

                  {/* <p className="leading-relaxed">Fam locavore kickstarter distillery. Mixtape chillwave tumeric sriracha taximy chia microdosing tilde DIY. XOXO fam indxgo juiceramps cornhole raw denim forage brooklyn. Everyday carry +1 seitan poutine tumeric. Gastropub blue bottle austin listicle pour-over, neutra jean shorts keytar banjo tattooed umami cardigan.</p> */}
                  <p>{data?.description}</p>
                </div>

                <div>
                  {/* Color + Size */}
                  <div className="md:flex grid grid-cols-2 md:grid-cols-1 mt-6 items-center justify-between pb-5 border-b-2 border-gray-100 mb-5">
                    {/* Colors */}
                    <div className="flex">
                      <span className="mr-3">Color</span>
                      {data?.variants.map((color) => {
                        return (
                          <button
                            onClick={() => {
                              console.log(color);
                              setSelectedSize(color.sizes[0]);
                              setSelectedColor(color);
                              setSelectedImage(color.images[0].url);
                            }}
                            key={color._id}
                            className={`${selectedColor.color == color.color && "border-2 border-black"} rounded-full mr-1 w-6 h-6`}
                            style={{ backgroundColor: color.color }}
                          ></button>
                        );
                      })}
                    </div>

                    {/* Size */}
                    <div className="flex ml-6 items-center">
                      <span className="mr-3">Size</span>
                      <div className="relative">
                        <select
                          className="rounded border border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10"
                          onChange={(e) => {
                            const selectedSize = selectedColor?.sizes.find(
                              (s) => s._id === e.target.value,
                            );
                            setSelectedSize(selectedSize);
                          }}
                        >
                          {selectedColor &&
                            selectedColor?.sizes.map((size) => {
                              return (
                                <option key={size._id} value={size._id}>
                                  {size.size}
                                </option>
                              );
                            })}
                        </select>
                      </div>
                    </div>

                    <p
                      className={`${selectedSize?.stock < 5 ? "text-red-500" : "text-green-600"} font-bold text-sm `}
                    >
                      {selectedSize?.stock} items left!
                    </p>
                    {
                      !currentUser && currentUser?.role !== "User"
                      ?
                      null
                      :
                    wishlisting ?
                    <Loader2 className="animate-spin"/>
                    :
                     wishlisted ? (
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="text-red-500 text-2xl"
                        onClick={removewishlistProduct}
                      />
                    ) : (
                      <Heart className="text-black" onClick={wishlistProduct} />
                    )}
                  </div>

                  {/* Price + Buttons */}
                  <div className="flex">
                    <div className="flex items-center">
                      <IndianRupee className="size-6 text-black" />
                      <span className="title-font font-medium text-2xl text-gray-900">
                        {selectedSize?.price}
                      </span>
                    </div>

                    <Button className="flex ml-auto" disabled={addingToCart || addedToCart} onClick={addProductToBag}>
                      {
                      addingToCart ?
                      <span className="flex items-center gap-2">Please wait
                        <Loader2 className="animate-spin"/>
                      </span>
                      :
                      addedToCart
                      ?
                      "Added to Bag"
                      :
                      "Add to Bag"}</Button>
                    {/* <button className="rounded-full w-10 h-10 bg-gray-200 inline-flex items-center justify-center text-gray-500 ml-4">
                <svg
                  fill="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 
                  5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 
                  1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
