"use client";

import { redirect } from "next/navigation";
import { useUser } from "../context/AuthContext";

export default function PrivateLayout({ children }) {
  const { currentUser, loadingAuth } = useUser();
  console.log(currentUser,loadingAuth)

  // ⏳ Wait until AuthContext finishes loading
  // if (loading) {
  //   return <div className="p-10 text-center">Loading...</div>;
  // }

  let a = true;
  console.log("hello private")


  if (!loadingAuth && currentUser) {
    redirect("/");
    return null;
  }

  return <>{children}</>;
}
