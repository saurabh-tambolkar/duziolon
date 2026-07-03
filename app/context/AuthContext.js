"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
// import { toast } from "@/components/ui/sonner";
import { getCookie } from "@/lib/getCookie";
import Image from "next/image";
import mainImg from "../assets/mainImage.png";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [bagLength, setBagLength] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let timer = setTimeout(() => {
      setLoading(false);
    },2000)
    console.log("3000 done")
    return () => clearTimeout(timer)
  }, []);

  const login = async (data) => {
    console.log(data);
    try {
      setIsSubmitting(true);
      setLoadingAuth(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/sign-in`,
        data,
        { withCredentials: true },
      );
      // const response = await apiC.post(`/login`,data,{withCredentials:true})
      if (response.data.success) {
        console.log(response.data.userDetails);
        getBagItemsLength(response.data.userDetails._id);
        setCurrentUser(response.data.userDetails);
        localStorage.setItem(
          "duziolonRefreshToken",
          response.data.refreshToken,
        );
        document.cookie = `duziolon=${response.data.accessToken}; max-age=86400; Secure; SameSite=Strict;`;
        if (response.data.userDetails.role == "Admin") {
          router.replace("/admin/category");
        } else {
          router.replace("/admin/products");
        }
        // router.push("/");
        toast.success("Logged In Successfully!");
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      setLoadingAuth(false);
    }
  };

  useEffect(() => {
    const cookieToken = getCookie("duziolon");
    const refreshToken = localStorage.getItem("duziolonRefreshToken");
    const token = cookieToken || refreshToken;

    if (token) {
      refreshTokenFn(token);
    } else {
      setLoadingAuth(false); // ⬅ important
    }
  }, []);

  // export const getCookie = (name) => {
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2) return parts.pop().split(";").shift();
  // };

  const refreshTokenFn = async (token) => {
    try {
      setLoadingAuth(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/verify-token/${token}`,
      );

      if (response.data.success) {
        setCurrentUser(response.data.userDetails);
        getBagItemsLength(response.data.userDetails._id)
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
  const getBagItemsLength = async (id) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/bag/get-bag-length`,{userId:id},
      );

      if (response.data.success) {
        setBagLength(response.data.numOfItemsIsBag)
      }
    } catch (error) {
      setCurrentUser(null);
    } finally {
    }
  };

  function logout(router) {
    // Remove tokens from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("duziolonRefreshToken");
    }
    toast.success("User logged out successfully!");
    setCurrentUser(null);
    document.cookie = "duziolon=; Max-Age=0; path=/;";
  }

  if (loadingAuth || loading) {
    return (
      <div className=" flex flex-col justify-center items-center min-h-screen">
        <Image src={mainImg} alt="Main Image" className="h-50 w-50 md:h-100 md:w-100" height={100} width={400}/>
        <Loader2 className="animate-spin size-6 mt-4" />
      </div>
    );
  }

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        isSubmitting,
        logout,
        loadingAuth,
        setLoadingAuth,
        getBagItemsLength,
        bagLength,
        setBagLength,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
