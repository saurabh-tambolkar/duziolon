// app/admin/layout.js
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

// only if you're using useState, useEffect, context, etc.

export default function AdminLayout({ children }) {
  let url = usePathname();

  const { currentUser, loadingAuth } = useUser();

  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // console.log("admin",loadingAuth,currentUser)
    if (loadingAuth) {
    } else if (!loadingAuth && !currentUser) {
      router.replace("/");
    } else if (currentUser && currentUser.role !== "Admin") {
      router.replace("/");
    }
  }, [currentUser, router, loadingAuth]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Admin Sidebar / Navbar / Wrapper */}
      {/* <header>Admin Header</header> */}
      <div className="bg-slate-800 p-8 flex md:hidden text-white justify-between">
        <h1
          className="font-bold text-xl cursor-pointer"
          onClick={() => router.replace("/")}
        >
          DUZIOLON
        </h1>
        {menuOpen ? (
          <X onClick={() => setMenuOpen(false)} className="size-6" />
        ) : (
          <Menu className="size-6" onClick={() => setMenuOpen(true)} />
        )}
      </div>
      <div
        className={`fixed top-35 right-0 bg-white border-black border-b-2 backdrop-blur-md z-50 rounded-b-2xl transition-all duration-300 transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } h-auto w-full md:hidden`}
      >
        <div className="space-y-4 flex mt-8 flex-col pl-8">
          <Link
            href={"/admin/dashboard"}
            onClick={()=>setMenuOpen(false)}
            className={`${url.includes("dashboard") && "font-bold bg-white text-black rounded p-1"}`}
          >
            Dashboard
          </Link>
          <Link
            href={"/admin/products"}
            onClick={()=>setMenuOpen(false)}
            className={`${url.includes("products") && "font-bold bg-white text-black rounded p-1"}`}
          >
            Products
          </Link>
          <Link
            href={"/admin/category"}
            onClick={()=>setMenuOpen(false)}
            className={`${url.includes("category") && "font-bold bg-white text-black rounded p-1"}`}
          >
            Category
          </Link>
          <Link
            href={"/admin/coupons"}
            onClick={()=>setMenuOpen(false)}
            className={`${url.includes("coupons") && "font-bold bg-white text-black rounded p-1"}`}
          >
            Coupons
          </Link>
          <Link
            href={"/admin/orders"}
            onClick={()=>setMenuOpen(false)}
            className={`${url.includes("orders") && "font-bold bg-white text-black rounded p-1"}`}
          >
            Orders
          </Link>
          <Link
            href={"/admin/tickets"}
            onClick={()=>setMenuOpen(false)}
            className={`${url.includes("tickets") && "font-bold bg-white text-black rounded p-1"}`}
          >
            Tickets
          </Link>
          <Link
            href={"/admin/users"}
            onClick={()=>setMenuOpen(false)}
            className={`${url.includes("users") && "font-bold bg-white text-black rounded p-1"}`}
          >
            Users
          </Link>
          {/* <Link href={"/admin/dashboard"}>Users</Link> */}
        </div>
      </div>
      <div className="hidden md:block w-80 bg-slate-900 text-white p-8">
        <h1
          className="font-bold text-xl cursor-pointer"
          onClick={() => router.replace("/")}
        >
          DUZIOLON
        </h1>
        <div className="mt-12 space-y-4 flex flex-col">
          <Link
            href={"/admin/dashboard"}
            className={`${url.includes("dashboard") && "font-bold bg-white text-black rounded p-1"}`}
          >
            Dashboard
          </Link>
          <Link
            href={"/admin/products"}
            className={`${url.includes("products") && "font-bold bg-white text-black rounded p-1"}`}
          >
            Products
          </Link>
          <Link
            href={"/admin/category"}
            className={`${url.includes("category") && "font-bold bg-white text-black rounded p-1"}`}
          >
            Category
          </Link>
          <Link
            href={"/admin/coupons"}
            className={`${url.includes("coupons") && "font-bold bg-white text-black rounded p-1"}`}
          >
            Coupons
          </Link>
          <Link
            href={"/admin/orders"}
            className={`${url.includes("orders") && "font-bold bg-white text-black rounded p-1"}`}
          >
            Orders
          </Link>
          <Link
            href={"/admin/tickets"}
            className={`${url.includes("tickets") && "font-bold bg-white text-black rounded p-1"}`}
          >
            Tickets
          </Link>
          <Link
            href={"/admin/users"}
            className={`${url.includes("users") && "font-bold bg-white text-black rounded p-1"}`}
          >
            Users
          </Link>
          {/* <Link href={"/admin/dashboard"}>Users</Link> */}
        </div>
      </div>

      {/* <main> */}
      {children}
      {/* </main> */}
    </div>
  );
}
