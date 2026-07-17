"use client";
import { IndianRupee, Loader2, MoveRightIcon, Tags, X } from "lucide-react";
import React, { useState } from "react";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import apiClient from "@/app/context/apiInstance";
import { useRouter } from "next/navigation";
import { initiatePayment } from "../lib/initiatePayment";
import { useUser } from "@/app/context/AuthContext";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

function OrderSummary({ data }) {
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [code, setCode] = useState("");
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const applyCoupon = async () => {
    try {
      setLoading(true);
      let values = {
        name: code,
      };
      const res = await apiClient.post(`/coupons/apply-coupon`, values);
      if (res.data.success) {
        setResult({
          couponName: code,
          discount: res.data?.discount || null,
          msg: res.data.message,
        });
        if (res?.data.discount) {
          calculateTotalAmount(data?.totalAmount, res?.data?.discount);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  let calculateTotalAmount = (subtotal, discount = 0) => {
    let discountAmount = (discount * subtotal) / 100;
    let finalDiscountAmount = subtotal - discountAmount;
    setTotalAmount(finalDiscountAmount);
    setResult((prev) => ({ ...prev, discountAmount }));
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      let res = await initiatePayment(totalAmount || data.totalAmount);
      console.log(res);
      let resultOfPreOrderCheckout = await apiClient.post(
        `/order/pre-order-checkout`,
        {
          id: res?.transactionId,
          isCouponApplied: result?.discount ? true : false,
          couponCode: result?.discount ? result?.couponName : "",
          couponCodeDiscount: result?.discount || 0,
          amount: data.totalAmount,
          address: selectedAddress,
        },
      );
      console.log(resultOfPreOrderCheckout);
      if (resultOfPreOrderCheckout.data.success) {
        router.push(res.redirectUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  let [addresses, setAddress] = useState([]);
  let getAddress = async () => {
    try {
      setLoading(true);
      let result = await apiClient.post("/address/addresses");
      if (result.data.success) {
        setAddress(result.data.addresses);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shadow-lg rounded-md p-4 md:mx-4 border md:sticky md:top-20">
      <h3
        className="text-xl font-bold mb-4 w-full"
        onClick={() => console.log(couponDetails)}
      >
        Order Summary
      </h3>

      <div className="flex justify-between mt-3 mb-3">
        <h3 className="text-gray-600 font-semibold">Subtotal </h3>
        <div className="flex items-center">
          <IndianRupee className="size-4" />
          <h3 className="font-bold text-lg">{data.totalAmount}</h3>
        </div>
      </div>
      {result && result.discount && (
        <div className="flex justify-between mt-3 mb-3">
          <h3 className="text-gray-600 font-semibold">Coupon </h3>
          <div className="flex items-center">
            <h3 className="font-bold text-lg">{result?.couponName}</h3>
          </div>
        </div>
      )}
      <div className="flex justify-between mt-3 mb-3">
        <h3 className="text-gray-600 font-semibold">
          Discount ({result?.discount || 0}%)
        </h3>
        <div className="flex items-center">
          <IndianRupee className="size-4 text-red-500" />
          <h3 className="font-bold text-lg text-red-500">
            -{result?.discountAmount || 0}
          </h3>
        </div>
      </div>
      <Separator />
      <div className="flex justify-between mt-3 mb-3">
        <h3 className="text-gray-600 font-semibold">Total</h3>
        <div className="flex items-center">
          <IndianRupee className="size-4" />
          <h3 className="font-bold text-lg">
            {totalAmount || data.totalAmount || 0}
          </h3>
        </div>
      </div>
      {showCouponInput && (
        <>
          <div className="relative">
            <Input
              placeholder={"Enter Coupon code"}
              className="mt-8"
              name={code}
              value={code}
              onChange={(e) => {setCode(e.target.value);setResult({})}}
            />
            {/* <X className="absolute right-2 top-2 text-gray-600 size-5" onClick={()=>{setShowCouponInput(false);setCode("")}}/> */}
          </div>
          <p
            className={`${result.discount ? "text-green-500" : "text-red-600"} font-bold text-xs p-2`}
          >
            {result?.msg}
          </p>
        </>
      )}
      <div className="flex justify-between mt-3 items-center mb-3">
        <h3 className="text-gray-400 text-xs font-semibold ml-8 flex items-center gap-2">
          <Tags className="size-4" /> Apply Coupon
        </h3>
        <div className="flex items-center">
          {(result && result.discount) || result.msg ? (
            <Button
              className="rounded-full text-xs pl-12 pr-12"
              onClick={() => {
                setShowCouponInput(false);
                setResult({});
                setCode("");
                setTotalAmount(data.totalAmount);
              }}
            >
              Remove Coupon
            </Button>
          ) : showCouponInput ? (
            <Button
              className="rounded-full text-xs pl-12 pr-12"
              disabled={loading}
              onClick={applyCoupon}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          ) : (
            <Button
              className="rounded-full text-xs pl-12 pr-12"
              onClick={() => setShowCouponInput(true)}
            >
              Apply
            </Button>
          )}
        </div>
      </div>
      {/* <Button className="w-full mt-8 gap-4 rounded-full" disabled={loading} onClick={handlePayment}>
            
            { loading
            ?
            <Loader2 className='animate-spin'/>
            :
            <>
            Go to Checkout
            <MoveRightIcon/>
            </>
             }
          </Button> */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="w-full mt-8 rounded-full h-12 text-base font-semibold"
            onClick={getAddress}
          >
            Checkout
            <MoveRightIcon className="ml-2 h-5 w-5" />
          </Button>
        </DialogTrigger>

        <DialogContent
          className=" w-full md:max-w-3xl"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Select Delivery Address
            </DialogTitle>

            <DialogDescription>
              Choose where you'd like your order to be delivered.
            </DialogDescription>
          </DialogHeader>

          {/* Addresses */}
          <div className="mt-6 gap-2 flex overflow-x-scroll space-y-4 max-h-[420px] overflow-y-auto pr-2">
            {addresses && addresses?.map((address) => (
              <label
                key={address._id}
                className={`flex gap-4 h-30 justify-center items-center rounded-2xl border p-2 cursor-pointer transition-all
            ${
              selectedAddress === address._id
                ? "border-black bg-gray-50 shadow-sm"
                : "hover:border-gray-400"
            }`}
              >
                <input
                  type="radio"
                  name="address"
                  value={address._id}
                  checked={selectedAddress === address._id}
                  onChange={() => setSelectedAddress(address._id)}
                  className="mt-1 accent-black"
                />

                <div className="flex-1">
                  <p className="mt-3 text-xs text-gray-700">
                    {address.flat}, {address.street}
                  </p>

                  <p className="text-gray-600 text-xs">{address.landmark}</p>

                  <p className="text-gray-600 text-xs">
                    {address.city}, {address.taluqa}
                  </p>

                  <p className="text-gray-600 text-xs">
                    {address.district}, {address.state}
                  </p>

                  <p className="text-gray-600 text-xs">
                    India - {address.postalCode}
                  </p>
                </div>
              </label>
            ))}

            {/* Add Address */}
            {/* <Button
        variant="outline"
        className="w-full rounded-xl border-dashed h-14"
      >
        + Add New Address
      </Button> */}
          </div>

          {/* Summary */}
          <div className="mt-6 rounded-2xl border bg-gray-50 p-5">
            {/* <div className="flex justify-between mb-3">
        <span className="text-gray-500">
          Items
        </span>

        <span className="font-medium">
          {bagItems.length}
        </span>
      </div> */}

            <div className="flex justify-between mb-3">
              <span className="text-gray-500">Total</span>

              <span className="font-medium">₹{data.totalAmount}</span>
            </div>

            {result?.discountAmount && (
              <div className="flex justify-between mb-3 text-green-600">
                <span>Coupon ({result.couponName})</span>

                <span>-₹{result.discountAmount}</span>
              </div>
            )}

            <div className="border-t mt-4 pt-4 flex justify-between text-lg font-bold">
              <span>Amount Payable</span>

              <span>₹{totalAmount || data.totalAmount}</span>
            </div>
          </div>

          <DialogFooter className="mt-6 gap-3">
            <DialogClose asChild>
              <Button variant="outline" className="rounded-xl">
                Cancel
              </Button>
            </DialogClose>

            <Button
              className="rounded-xl px-8"
              disabled={!selectedAddress || isSubmitting}
              onClick={handlePayment}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Continue to Payment
                  <MoveRightIcon className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default OrderSummary;
