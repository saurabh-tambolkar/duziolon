"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  IndianRupee,
  CheckCircle2,
  Clock3,
  XCircle,
  Dot,
  MapPin,
} from "lucide-react";
import Link from "next/link";

function OrderItem({ item }) {
  const [open, setOpen] = useState(false);

  const saved =
    Number(item.totalAmount || 0) - Number(item.totalAmountPaid || 0);

  const getStatusColor = () => {
    switch (item.orderStatus) {
      case "SUCCESS":
        return "text-green-700 bg-green-50 border-green-200";
      case "FAILED":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
    }
  };

  const getStatusIcon = () => {
    switch (item.orderStatus) {
      case "SUCCESS":
        return <CheckCircle2 className="w-4 h-4" />;
      case "FAILED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock3 className="w-4 h-4" />;
    }
  };

  return (
    <div className="mt-8 overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all shadow duration-300 hover:shadow-lg">
      {/* ---------------- Header ---------------- */}

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between px-4 py-4">
        <div>
          <h2 className="text-xl font-semibold tracking-wide text-neutral-900">
            Order #{item._id.slice(-8).toUpperCase()}
          </h2>

          <div className="flex flex-row md:flex-col items-baseline md:flex-row gap-4 md:items-baseline">
          <p className="mt-2 text-xs font-semibold text-neutral-500">
            {item.time.split("T")[0]}
          </p>
          <span className="w-2 h-2 rounded-full bg-gray-400"></span>
            <span className="text-xs text-gray-600 font-medium">
            {item.items.length} Item{item.items.length > 1 ? "s" : ""}
          </span>
          </div>
          <p className="flex items-center mt-4 gap-2 text-sm"><MapPin className="size-4"/> {item.address.flat} {item.address.street}, {item.address.landmark}, {item.address.city}, {item.address.district}, {item.address.state}.</p>
        </div>

        <div className="flex justify-between  items-center gap-4 ">
          <span
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ${getStatusColor()}`}
          >
            {getStatusIcon()}
            {item.orderStatus}
          </span>

           
          <button
            onClick={() => setOpen(!open)}
            className="rounded-full border p-2 transition hover:bg-neutral-100"
          >
            {open ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

       {open && (
        <div className="px-6 py-6 border-y border-neutral-200">
          <div className="space-y-6">
            {item.items.map((product) => (
              <div
                key={product._id}
                className="flex flex-col gap-6 border-b border-neutral-200 last:border-0"
              >
                <div className="flex  md:flex-row gap-6 items-start">
                  <Link href={`/products/${product.product.gender}/${product.product._id}`}>
                  <Image
                    src={product.product.image.url}
                    width={140}
                    height={170}
                    alt={product.product.name}
                    className="rounded-2xl border object-contain w-30 h-30"
                    />
                    </Link>

                  <div className="flex flex-1 flex-col md:flex-row justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {product.product.name}
                      </h3>

                      <p className="mt-2 text-sm text-neutral-500">
                        {product.product.category}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-8 text-sm text-neutral-600">
                        <div>
                          <p className="text-neutral-400">Size</p>
                          <p className="mt-1 font-medium">{product.size}</p>
                        </div>

                        <div>
                          <p className="text-neutral-400">Quantity</p>
                          <p className="mt-1 font-medium">
                            {product.quantity}
                          </p>
                        </div>

                        <div>
                          <p className="text-neutral-400">Color</p>

                          <div
                            className="mt-2 h-5 w-5 rounded-full border"
                            style={{
                              backgroundColor: product.product.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center text-xl text-gray-600 font-semibold">
                      <IndianRupee className="mr-1 h-5 w-5" />
                      {product.price}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      <div className=" border-neutral-200 bg-neutral-50/40 px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 ">
          <div>
            <p className="text-sm text-neutral-500">Total Amount</p>

            <h3 className="mt-2 flex items-center text-xl font-semibold">
              <IndianRupee className="mr-1 h-4 w-4" />
              {item.totalAmount}
            </h3>
          </div>
          <div>
            <p className="text-sm text-neutral-500">You Saved</p>

            <h3 className="mt-2 text-xl font-semibold text-green-700">
              ₹{saved.toFixed(2)}
            </h3>
          </div>


          <div>
            <p className="text-sm text-neutral-500">Coupon</p>

            {item.isCouponApplied ? (
              <>
                <h3 className="mt-2 font-semibold uppercase">
                  {item.couponCode}
                </h3>

                <p className="text-sm text-green-700">
                  {item.couponCodeDiscount}% OFF
                </p>
              </>
            ) : (
              <h3 className="mt-2 text-neutral-400">
                Not Applied
              </h3>
            )}
          </div>
          <div>
            <p className="text-sm text-neutral-500">Amount Paid</p>

            <h3 className="mt-2 flex items-center text-xl font-semibold">
              <IndianRupee className="mr-1 h-4 w-4" />
              {item.totalAmountPaid}
            </h3>
          </div>

        </div>
      </div>
        </div>
      )}

      {/* ---------------- Summary ---------------- */}


      {/* ---------------- Products ---------------- */}

     
    </div>
  );
}

export default React.memo(OrderItem);