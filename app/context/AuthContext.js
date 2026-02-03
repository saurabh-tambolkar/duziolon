"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import { toast } from "@/components/ui/sonner";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const router = useRouter();

  
  const login = async (data) => {
    console.log(data);
    try {
      setIsSubmitting(true);
      // setLoadingAuth(true)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/sign-in`,
        data,
        { withCredentials: true }
      );
      // const response = await apiC.post(`/login`,data,{withCredentials:true})
      if (response.data.success) {
        console.log(response.data.userDetails);
        setCurrentUser(response.data.userDetails);
        localStorage.setItem(
          "duziolonRefreshToken",
          response.data.refreshToken
        );
        document.cookie = `duziolon=${response.data.accessToken}; max-age=86400; Secure; SameSite=Strict;`;
        router.push("/");
        toast.success("Logged In Successfully!");
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      // setLoadingAuth(false)
    }
  };

useEffect(() => {
  const cookieToken = getCookie("duziolon");
  const refreshToken = localStorage.getItem("duziolonRefreshToken");
  const token = cookieToken || refreshToken;

  if (token) {
    refreshTokenFn(token);
  } else {
    setLoadingAuth(false);  // ⬅ important
  }
}, []);


const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

const refreshTokenFn = async (token) => {
  try {
    setLoadingAuth(true)
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/verify-token/${token}`
    );

    if (response.data.success) {
      setCurrentUser(response.data.userDetails);

      document.cookie = `duziolon=${response.data.accessToken}; max-age=${
        60 * 60
      }; Secure; SameSite=Strict; Path=/`;
    }
  } catch (error) {
    setCurrentUser(null);
  } finally {
    setLoadingAuth(false);
  }
};


function logout(router) {
  // Remove tokens from localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem("duziolonRefreshToken");
  }
  toast.success("User logged out successfully!")
  setCurrentUser(null)
  document.cookie = "duziolon=; Max-Age=0; path=/;";

}





  return (
    <UserContext.Provider
      value={{ currentUser, setCurrentUser, login, isSubmitting,logout,loadingAuth,setLoadingAuth }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
