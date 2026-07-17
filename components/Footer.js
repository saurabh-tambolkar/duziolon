"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function Footer() {
  let url = usePathname();

  return (
    <div
      className={`bg-white ${url.includes("admin") ? "hidden" : "block"} border-t-2 text-black mt-24 border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.15)] pt-6`}
    >
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4 place-items-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Duziolon</h2>
          <p className="text-sm">Designed for comfort.</p>
          <p className="text-sm">Made for style.</p>
          <p className="text-sm">Loved by you.</p>
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Shop</h2>
            <Link href="/products/mens" className="hover:underline">
              Men's Clothing
            </Link>
            <Link
              href="/products/womens"
              className="hover:underline
"
            >
              Women's Clothing
            </Link>
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Shop</h2>
            <Link href="/products/mens" className="hover:underline">
              Men's Clothing
            </Link>
            <Link
              href="/products/womens"
              className="hover:underline
"
            >
              Women's Clothing
            </Link>
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Company</h2>
            <Link href="/products/mens" className="hover:underline">
              About Us
            </Link>
            <Link href="/products/mens" className="hover:underline">
              Contact Us
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:underline
"
            >
              Privacy Policy
            </Link>
        </div>
      </div>
      <p className="text-center text-gray-100 text-sm mt-8">
        Duziolon @ copyright 2025
      </p>
    </div>
  );
}

export default Footer;
