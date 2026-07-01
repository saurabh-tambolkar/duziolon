"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import {
  CircleUserRound,
  Handbag,
  HandbagIcon,
  Menu,
  User,
  User2Icon,
  X,
} from "lucide-react";
import { useUser } from "@/app/context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping, faUser } from "@fortawesome/free-solid-svg-icons";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "./ui/separator";
import {  optionsProfUser,optionsProfAdmin,navOptions, navOptionsMobile } from "@/lib/navRoutes"
import { Badge } from "./ui/badge";

function Navbar() {
  const url = usePathname()

  const [blur, setBlur] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const { currentUser, logout, bagLength } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setBlur(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // let optionsProfUser = [
  //   {
  //     name: "Profile",
  //     path: "/profile",
  //   },
  //   {
  //     name: "Wishlist",
  //     path: "/wishlist",
  //   },
  //   {
  //     name: "Settings",
  //     path: "/settings",
  //   },
  // ];
  

  let optionsProf = currentUser && currentUser?.role == "Admin" ? optionsProfAdmin : optionsProfUser

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
        {navOptions.map((item) => {
          let href =item.path;
          // href = href.replace("/","")

          const isActive = url == href;

          return (
            <Link
              key={item.name}
              href={href}
              prefetch
              className={
                isActive ? "border-b-2 border-b-gray-950 font-bold" : ""
              }
            >
              {item.name}
            </Link>
          );
        })}
      </div>
      {currentUser ? (
        <div className="hidden md:flex items-center gap-8">
          {
            currentUser.role == "User" &&
          <Link href="/bag" className="relative">
          <Handbag size={24} />
            <Badge className="absolute -top-2 -right-3 rounded-full text-xs pl-2 pr-2">{bagLength || 0}</Badge>
          </Link>
          }

          <HoverCard openDelay={10} closeDelay={100}>
            <HoverCardTrigger asChild>
              <CircleUserRound size={24} />
            </HoverCardTrigger>
            <HoverCardContent className="flex w-auto flex-col gap-3">
              <div className="font-bold p-1">
                Hello, {currentUser?.name?.split(" ")[0] || "User"}
              </div>
              <Separator />
              <div className="flex flex-col gap-1">
                {optionsProf &&
                  optionsProf.map((item) => {
                    return (
                      <Link key={item.name} href={item.path}>
                        <p className="font-semibold">{item.name}</p>
                      </Link>
                    );
                  })}
              </div>
              <Separator />
              <Button
                className="bg-red-500 font-bold hover:bg-red-400"
                onClick={logout}
              >
                Logout
              </Button>
            </HoverCardContent>
          </HoverCard>
        </div>
      ) : (
        <Button className="hidden md:block">
          <Link href={"/sign-in"}>Sign In</Link>
        </Button>
      )}

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
          {navOptionsMobile.map((item) => {
          let href =item.path;
          // href = href.replace("/","")

          const isActive = url == href;

          return (
            <Link
              key={item.name}
              href={href}
              prefetch
              onClick={() => setMenuIsOpen(false)}
              className={
                isActive ? "border-b-2 border-b-gray-950 font-bold" : ""
              }
            >
              {item.name}
            </Link>
          );
        })}
          {/* <Link
            href="/"
            className="text-black text-lg"
            // onClick={() => setMenuIsOpen(false)}
          >
            Accessories
          </Link> */}
          {currentUser ? (
            <div className="flex flex-col items-center gap-2">
              <Link href={"/wishlist"}   onClick={() => setMenuIsOpen(false)}>
              <p>Wishlist</p>
              </Link>
              <Link href={"/orders"}   onClick={() => setMenuIsOpen(false)}>
              <p>Orders</p>
              </Link>
             <Link href="/bag" className=" mt-2 relative">
          <Handbag size={24} />
            <Badge className="absolute -top-2 -right-3 rounded-full text-xs pl-2 pr-2">{bagLength || 0}</Badge>
          </Link>
              <Link className="mt-4" href={"/profile"}   onClick={() => setMenuIsOpen(false)}>
                <User size={24} />
              </Link>
            </div>
          ) : (
            <Button className="block"   onClick={() => setMenuIsOpen(false)}>
              <Link href={"/sign-in"}>Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
