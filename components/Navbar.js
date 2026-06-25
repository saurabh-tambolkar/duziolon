"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { CircleUserRound, Handbag, HandbagIcon, Menu, User, User2Icon, X } from "lucide-react";
import { useUser } from "@/app/context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping, faUser } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const url = usePathname().replace("/", "");

  const [blur, setBlur] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const {currentUser,logout} = useUser()

  useEffect(() => {
    const handleScroll = () => {
      setBlur(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`${url.includes("admin") ? "hidden" : "block"} w-full border-b-2 shadow-sm fixed top-0 backdrop-blur-md transition-all duration-300 z-50 
      ${blur ? "bg-white/70 shadow-lg border-b border-gray-200" : "bg-white"}
      flex justify-between md:justify-around items-center p-6`}
    >
      <h1
        className="font-bold text-xl"
        onClick={() => console.log(currentUser)}
      >
        DUZIOLON
      </h1>

      <div className=" hidden  md:flex gap-8">
        {/* Home */}
        <Link
          href="/"
          className={url === "" ? "border-b-2 border-b-gray-950 font-bold" : ""}
        >
          Home
        </Link>

        {/* Wearables */}
        <Link
          href="/products/mens"
          className={
            url.includes("/mens")
              ? "border-b-2 border-b-gray-950 font-bold"
              : ""
          }
        >
          Mens
        </Link>

        {/* Accessories */}
        <Link
          href="/products/womens"
          className={
            url.includes("/womens")
              ? "border-b-2 border-b-gray-950 font-bold"
              : ""
          }
        >
          Womens
        </Link>
        {/* <Link
          href="/accessories"
          className={url === "accessories" ? "border-b-2 border-b-gray-950 font-bold" : ""}
        >
          Accessories
        </Link> */}
      </div>
        {
          currentUser ?
          <div className="flex items-center gap-8">
            <Handbag size={24} onClick={logout}/>
            <Link href={'/profile'}>
            <CircleUserRound size={24}/>
            </Link>
            </div>
            :
            <Button>
              <Link href={'/sign-in'}>Sign In</Link></Button>
        }

      <div className="flex gap-4 md:hidden">
        {menuIsOpen ? (
          <X
            className="text-black block md:hidden"
            onClick={() => setMenuIsOpen(false)}
          />
        ) : (
          <Menu
            className="text-black block md:hidden"
            onClick={() => setMenuIsOpen(true)}
          />
        )}
      </div>

      <div
        className={`fixed top-18 right-0 bg-white border-black border-b-2 backdrop-blur-md z-50 rounded-b-2xl transition-all duration-300 transform ${
          menuIsOpen ? "translate-x-0" : "translate-x-full"
        } h-auto w-full md:hidden`}
      >
        <div className="flex flex-col items-center space-y-4 py-6">
          <Link
            href="/"
            className={
              url == ""
                ? "border-b-2 border-b-gray-950 font-bold"
                : " text-black text-lg"
            }
            onClick={() => setMenuIsOpen(false)}
          >
            Home
          </Link>

          <Link
            href="/products/mens"
            className={
              url.includes("/mens")
                ? "border-b-2 border-b-gray-950 font-bold"
                : " text-black text-lg"
            }
            onClick={() => setMenuIsOpen(false)}
          >
            Mens
          </Link>
          <Link
            href="/products/womens"
            className={
              url.includes("/womens")
                ? "border-b-2 border-b-gray-950 font-bold"
                : " text-black text-lg"
            }
            onClick={() => setMenuIsOpen(false)}
          >
            Womens
          </Link>
          {/* <Link
            href="/"
            className="text-black text-lg"
            // onClick={() => setMenuIsOpen(false)}
          >
            Accessories
          </Link> */}
          <User className="text-red bg-red-500 size-4"/>
          
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
