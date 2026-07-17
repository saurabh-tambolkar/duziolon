// HomeCarousel.jsx

import HomeCarouselClient from "./Caraosel";

export default async function HomeCarousel() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/products/mens/all`,
    {
      cache: "no-cache",
    }
  );

  const data = await res.json();

  return <HomeCarouselClient products={data.products} />;
}