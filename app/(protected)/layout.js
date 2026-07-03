"use client";

import { redirect } from "next/navigation";
import { useUser } from "../context/AuthContext";

export default function ProtectedLayout({ children }) {
  const { currentUser, loadingAuth } = useUser();

  // ⏳ Wait until AuthContext finishes loading
  // if (loading) {
  //   return <div className="p-10 text-center">Loading...</div>;
  // }

  // let a = null;
  console.log("hello protected")
  
  if(!loadingAuth && currentUser && currentUser.role !== "User"){
    redirect("/")
    return null
  }
  else if (!loadingAuth && !currentUser) {
    console.log("hello protected2")
    redirect("/sign-in");
    return null;
  }

  return <div className="min-h-screen">{children}</div>;
}
