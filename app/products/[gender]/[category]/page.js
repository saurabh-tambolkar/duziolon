import Link from "next/link";
import CardItem from "../../../../components/CardItem";
import CatLabels from "../../../../components/CatLabels";

// export const revalidate = 60; // cache for 60 seconds

export default async function Page({params}) {
  let {gender,category} = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/products/${gender}/${category}`,{
  cache: "no-cache"
});
  const data = await res.json();

  const resCat = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/categories`,{
  cache: "force-cache"
});
let catData = await resCat.json()

  return (
    <div className="min-h-screen pt-30 mx-auto w-11/12">
      <div className="flex justify-between items-center">
      <h1 className='text-2xl text-black font-bold'>{gender.slice(0,1).toLocaleUpperCase()+gender.slice(1)} Fashion</h1>
      <CatLabels categories={catData.categories}/>
      </div>

    {
      data?.products?.length == 0 && <p className="text-center mt-40">No products found!</p>
    }
      <div className='mt-12 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-8'>
        {data.products?.map((item) => (
          <CardItem key={item._id} product={item} />
        ))}
      </div>
    </div>
  );
}
