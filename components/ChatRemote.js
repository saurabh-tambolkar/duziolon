"use client";

import { useEffect, useState } from "react";
import mf from "@/lib/federation/chat";
import {useUser} from "../app/context/AuthContext"

export default function ChatRemote({ ticketId,receiverId }) {
  const [Chat, setChat] = useState(null);

  const {currentUser} = useUser()

  useEffect(() => {
    async function loadChat() {
      try {
        const module = await mf.loadRemote("chatApp/Chat");

        setChat(() => module.default);
      } catch (error) {
        console.error("Failed to load Chat MFE:", error);
      }
    }

    loadChat();
  }, []);

  if (!Chat) {
    return <div>Loading chat...</div>;
  }

  return <Chat ticketId={ticketId} receiverId={receiverId} currentUser={currentUser}/>;
}