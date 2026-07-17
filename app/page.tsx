import Image from "next/image";
import React from "react";
import HomePic1 from "./assets/homePic1.jpg";
import { Button } from "@/components/ui/button";
import {MoveRight} from "lucide-react"
import Features from "../components/Features";
import HomeMain from "../components/HomeMain";
import HomeCarousel from "../components/HomeCarousel";
import CategoryCard from "../components/CategoryCard";
import Link from "next/link";

function page() {
  return (
    <div className="bg-white min-h-screen ">
      <HomeMain/>
      <Features/>
      <HomeCarousel/>
      <CategoryCard/>
    </div>
  );
}

export default page;
