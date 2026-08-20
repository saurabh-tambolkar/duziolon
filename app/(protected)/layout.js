"use client";

import { redirect } from "next/navigation";
import { useUser } from "../context/AuthContext";

export default function ProtectedLayout({ children }) {
  const { currentUser, loadingAuth } = useUser();

  
  if(!loadingAuth && currentUser && currentUser.role !== "User"){
    redirect("/")
    return null
  }
  else if (!loadingAuth && !currentUser) {
    redirect("/sign-in");
    return null;
  }

  return <div className="min-h-screen">{children}</div>;
}
