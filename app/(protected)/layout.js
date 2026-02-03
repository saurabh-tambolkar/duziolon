"use client";

import { redirect } from "next/navigation";
import { useUser } from "../context/AuthContext";

export default function ProtectedLayout({ children }) {
  const { currentUser, loadingAuth } = useUser();
  console.log(currentUser,loadingAuth)

  // ⏳ Wait until AuthContext finishes loading
  // if (loading) {
  //   return <div className="p-10 text-center">Loading...</div>;
  // }

  // let a = null;
  console.log("hello protected")

  if (!loadingAuth && !currentUser) {
    redirect("/sign-in");
    return null;
  }

  return <>{children}</>;
}
