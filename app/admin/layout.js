// app/admin/layout.js
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {useUser} from "../context/AuthContext"
import { useEffect } from "react";

   // only if you're using useState, useEffect, context, etc.

export default function AdminLayout({ children }) {

    let url = usePathname();

    const {currentUser,loadingAuth} = useUser();

     const router = useRouter();

    useEffect(()=>{
      if(loadingAuth){

      }
      else if(!currentUser){
        router.replace('/')
      }
      else if(currentUser && currentUser.role !== "Admin"){
          router.replace("/");
      }
    },[currentUser,router])

    console.log('admin layout')

  return (
    <div className="min-h-screen flex ">
      {/* Admin Sidebar / Navbar / Wrapper */}
      {/* <header>Admin Header</header> */}
      <div className="w-80 bg-slate-900 text-white p-8">
        <h1 className="font-bold text-xl">DUZIOLON</h1>
        <div className="mt-12 space-y-4 flex flex-col">
            <Link href={"/admin/dashboard"} className={`${url.includes('dashboard') && "font-bold bg-white text-black rounded p-1"}`}>Dashboard</Link>
            <Link href={"/admin/products"} className={`${url.includes('products') && "font-bold bg-white text-black rounded p-1"}`}>Products</Link>
            <Link href={"/admin/category"} className={`${url.includes('category') && "font-bold bg-white text-black rounded p-1"}`}>Category</Link>
            <Link href={"/admin/dashboard"}>Orders</Link>
            <Link href={"/admin/dashboard"}>Coupons</Link>
            <Link href={"/admin/dashboard"}>Users</Link>
        </div>
      </div>
      

      {/* <main> */}
        {children}
      {/* </main> */}
    </div>
  );
}
