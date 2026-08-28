'use client'
import { useParams, usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import ChatRemote from '../../../../components/ChatRemote'
import TicketDetails  from '../../../../components/TicketDetails'
import { Loader2 } from 'lucide-react'
import apiClient from '@/app/context/apiInstance'

function page() {

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
          const response = await apiClient.get(`/tickets/tickets/admin/${id}`,);
    
          if (response.data.success) {
            const ticket = response.data.ticketDetails;
    
            setDetails(ticket);
            const receiverId = isAdmin ? ticket?.user?.id : ticket?.adminId;
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
    <div className='min-h-screen w-full pt-12'>
      <h1 className="text-xl font-semibold mb-4 ml-4">Ticket Resolution</h1>
     <div className="min-h-screen flex px-4 flex-col md:flex-row w-full gap-2 pb-24 md:pb-0">
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
          {receiverId !== null && (
            <ChatRemote ticketId={id} receiverId={receiverId} />
          )}
        </>
      )}
      {/* LEFT SIDE - TICKET DETAILS */}
    </div>
    </div>

  )
}

export default page