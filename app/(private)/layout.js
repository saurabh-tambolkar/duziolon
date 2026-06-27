// "use client";

// import { redirect } from "next/navigation";
// import { useUser } from "../context/AuthContext";

// export default function PrivateLayout({ children }) {
//   const { currentUser, loadingAuth } = useUser();
//   console.log(currentUser,loadingAuth)

//   // ⏳ Wait until AuthContext finishes loading
//   // if (loading) {
//   //   return <div className="p-10 text-center">Loading...</div>;
//   // }

//   let a = true;
//   console.log("hello private")


//   if (!loadingAuth && currentUser) {
//     redirect("/");
//     return null;
//   }

//   return <>{children}</>;
// }

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/AuthContext";

export default function PrivateLayout({ children }) {
  const { currentUser, loadingAuth } = useUser();
  const router = useRouter();

  useEffect(() => {
  console.log("Layout redirect check", {
    loadingAuth,
    currentUser,
  });

  if (loadingAuth) return;

  if (currentUser?.role === "Admin") {
    console.log("Redirecting admin");
    router.replace("/admin/category");
  } else if (currentUser) {
    console.log("Redirecting user");
    router.replace("/");
  }
}, [currentUser, loadingAuth, router]);

  // useEffect(() => {
  //   if (!loadingAuth && currentUser) {
  //     router.replace('/')
  //   }
  // }, [currentUser, loadingAuth, router]);

  // useEffect(() => {
  //   if (!loadingAuth && currentUser && currentUser.role == "Admin") {
  //       router.replace("/admin/category");
  //   }else{
  //     router.replace('/')
  //   }
  // }, [currentUser, loadingAuth, router]);

  // if (loadingAuth) {
  //   return <div>Loading...</div>;
  // }

  if (currentUser) {
    return null;
  }

  return <>{children}</>;
}