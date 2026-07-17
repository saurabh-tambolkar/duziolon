"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import CardItem from "../components/CardItem";

export default function HomeCarouselClient({ products }) {
  const plugin = React.useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
    })
  );

  return (
    <div className=" h-[30rem] md:min-h-screen flex justify-center items-center">
      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-8/12 md:max-w-8/12 p-2"
      >
        <CarouselContent className="-ml-4">
          {products.map((item) => (
            <CarouselItem
              key={item._id}
              className=" pl-4 basis-full lg:basis-1/3"
            >
              <CardItem product={item} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}