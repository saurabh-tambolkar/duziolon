import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import {getStatusIcon,getStatusColor,} from "./OrderItem";
import { toast } from "sonner";
import { Separator } from "../components/ui/separator";
import Link from "next/link";
import apiClient from "../app/context/apiInstance";
import { useState } from "react";
import { getStatusStyles } from "./ProfilerForm"

const TicketDetails = ({ id,details,isAdmin }) => {

  const [resolving,setResolving] = useState(false)
  const [resolved,setResolved] = useState(details?.status == "closed" ? true : false)

    const getOrdersPageLink = () => {
    if (isAdmin) {
      return `/admin/orders/${details?.order?.orderId}`;
    }

    return `/orders/${details?.orderId}`;
  };

  const resolveTicket=async()=>{
    try{
      setResolving(true)
      const response = await apiClient.put(`/tickets/mark-resolve/${id}`)
      if(response.data.success){
        setResolved(true)
        toast.success(response.data.message)
      }
    }
    catch(err){
      console.log(err)
      toast.success(response.data.message || "error")
    }
    finally{
      setResolving(false)
    }
  }

  return (
    <div
      className="
      h-[40vh]
      md:h-[80vh]
        w-full
        md:w-1/3
        bg-white
        rounded-lg
        border
        border-gray-200
        shadow-md
        flex
        flex-col
        overflow-hidden
      "
      // style={{ height: "80vh" }}
    >
     
          <div className="flex-1 overflow-y-auto p-4">
            {/* Ticket Header */}
            <div>
              <h1 className="text-gray-800 font-bold text-md mb-4">
                Ticket Details
              </h1>

              <h1 className="text-gray-800 font-bold text-sm my-2">
                Ticket: <span className="font-medium text-gray-600">{id}</span>
              </h1>

              {/* Order */}
              <h1 className="text-gray-800 font-bold text-sm">
                Order:{" "}
                <Link
                  className="text-blue-500 hover:underline"
                  href={getOrdersPageLink()}
                >
                  {isAdmin ? details?.order?.orderId : details?.orderId}
                </Link>
              </h1>

              {/* Status + Created At */}
              <div className="flex justify-between items-center my-4 gap-2">
                <p
                  className={`
                    text-xs
                    ${getStatusStyles(details?.status)}
                    rounded-full
                    px-2
                    py-1
                  `}
                >
                  Status:  {details?.status?.charAt(0).toUpperCase() + details?.status?.slice(1)}
                </p>

                <p className="text-xs font-semibold text-gray-700">
                  Created At: {details?.createdAt?.split("T")[0]}
                </p>
              </div>

              <Separator className="my-4" />

              {/* ========================================= */}
              {/* ISSUE DETAILS                             */}
              {/* ========================================= */}

              <div>
                <h1 className="text-sm font-bold">Subject:</h1>

                <p className="text-sm text-gray-700 mt-1">{details?.subject}</p>

                <h1 className="text-sm font-bold mt-4">Description:</h1>

                <p className="text-xs font-semibold text-gray-700 mt-1">
                  {details?.description}
                </p>
              </div>

              {/* ========================================= */}
              {/* ADMIN ONLY - USER DETAILS                 */}
              {/* ========================================= */}

              {isAdmin && (
                <>
                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <h1 className="text-gray-800 font-bold text-md mb-2">
                      User Details
                    </h1>

                    <div className="text-xs font-semibold text-gray-700 flex justify-between gap-4">
                      <span className="text-black font-bold">Name:</span>

                      <span className="text-right">{details?.user?.name}</span>
                    </div>

                    <div className="text-xs font-semibold text-gray-700 flex justify-between gap-4">
                      <span className="text-black font-bold">Email:</span>

                      <span className="text-right break-all">
                        {details?.user?.email}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-gray-700 flex justify-between gap-4">
                      <span className="text-black font-bold">Phone:</span>

                      <span>{details?.user?.phone}</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* ========================================= */}
                  {/* ORDER DETAILS                              */}
                  {/* ========================================= */}

                  <div className="space-y-3">
                    <h1 className="text-gray-800 font-bold text-md mb-2">
                      Order Details
                    </h1>

                    <div className="text-xs font-semibold text-gray-700 flex justify-between gap-4">
                      <span className="text-black font-bold">Amount Paid:</span>

                      <span>{details?.order?.totalAmountPaid}</span>
                    </div>

                    <div className="text-xs font-semibold text-gray-700 flex justify-between gap-4">
                      <span className="text-black font-bold">
                        Payment Status:
                      </span>

                      <span>{details?.order?.paymentStatus}</span>
                    </div>

                    <div className="text-xs font-semibold text-gray-700 flex justify-between gap-4">
                      <span className="text-black font-bold">Coupon:</span>

                      <span className="text-right">
                        {details?.order?.couponCode || "No coupon was applied."}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-gray-700 flex justify-between gap-4">
                      <span className="text-black font-bold">
                        Coupon Discount:
                      </span>

                      <span>{details?.order?.couponCodeDiscount}</span>
                    </div>

                    <div className="text-xs font-semibold text-gray-700 flex justify-between gap-4">
                      <span className="text-black font-bold">
                        Order Placed On:
                      </span>

                      <span>{details?.order?.time?.split("T")[0]}</span>
                    </div>

                    <div className="text-xs font-semibold text-gray-700 flex justify-between gap-4">
                      <span className="text-black font-bold">
                        Expected Delivery:
                      </span>

                      <span>
                        {details?.order?.expectedDeliveryDate?.split("T")[0]}
                      </span>
                    </div>

                    {/* Order Status */}
                    <span
                      className={`
                        flex
                        w-full
                        mt-4
                        text-center
                        items-center
                        justify-center
                        gap-2
                        rounded-full
                        border
                        px-4
                        py-2
                        text-xs
                        font-bold
                        ${getStatusColor(details?.order?.status)}
                      `}
                    >
                      {getStatusIcon(details?.order?.status)}

                      {details?.order?.status}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="shrink-0 border-t bg-white p-4">
            <Button
              className={`
                w-full
                border
                shadow
                bg-gray-200
                text-black
                font-bold
                hover:bg-gray-100
                ${resolving ? "cursor-progress" : resolved ? "cursor-not-allowed" : "cursor-pointer"}
                `}
              onClick={resolveTicket}
              disabled={resolving || resolved}
            >
              {
                resolving
                ?
                <Loader2 className="animate-spin"/>
                :
                resolved
                ?
                "Resolved"
                :
              "Mark as Resolved"
              }
            </Button>
          </div>
    </div>
  );
};

export default TicketDetails