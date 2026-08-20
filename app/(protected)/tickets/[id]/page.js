"use client";

import React, { useEffect, useState } from "react";
import ChatRemote from "../../../../components/ChatRemote";
import { useParams, usePathname } from "next/navigation";
import apiClient from "@/app/context/apiInstance";
import { Loader2 } from "lucide-react";
import TicketDetails from "../../../../components/TicketDetails"

function Page() {
  const { id } = useParams();

   const url = usePathname()
  const isAdmin = url.includes("admin");
  console.log("HOST ticket id:", id);

  const [receiverId, setReceiverId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(null);

  const getTicketDetails = async () => {
    try {
      setLoading(true);
      console.log("calling admin api",isAdmin)

      const response = await apiClient.get(`/tickets/tickets/${id}`,);
      // const response = await apiClient.get(
      //   isAdmin ? `/tickets/tickets/admin/${id}` : `/tickets/tickets/${id}`,
      // );

      console.log("Ticket API response:", response.data);

      if (response.data.success) {
        console.log(response.data.ticketDetails)
        const ticket = response.data.ticketDetails;

        setDetails(ticket);
        const receiverId = isAdmin ? ticket?.user?.id : ticket?.adminId;

        console.log("Receiver ID:", receiverId);

        setReceiverId(receiverId);
      }
    } catch (error) {
      console.log("Failed to fetch ticket details:", error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    getTicketDetails();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row pt-24 w-full gap-2 px-4">
      {loading ? (
        <Loader2 className="animate-spin size-4" />
      ) : (
        <>
          <TicketDetails
            id={id}
            details={details}
            isAdmin={isAdmin}
          />

          {/* RIGHT SIDE - CHAT */}
          {(receiverId !== null && details?.status !== "closed") ? (
            <ChatRemote ticketId={id} receiverId={receiverId} />
          )
          :
          <div className="w-full">
            <p className="text-gray-600 font-bold text-sm text-center mt-24">This ticket has been resolved.</p>
            <p className="text-gray-400 font-bold text-xs text-center">We are glad we were able to resolve your queries.</p>
          </div>
        }
        </>
      )}
      {/* LEFT SIDE - TICKET DETAILS */}
    </div>
  );
}

export default Page;


