import CardItem from "../../../components/CardItem";

export const revalidate = 60; // cache for 60 seconds

export default async function Page({params}) {
  let {gender} = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/products/${gender}`,
    {
      cache: "force-cache",
    }
  );
  const data = await res.json();
  console.log("data", data);

  return (
    <div className="min-h-screen pt-30 mx-auto w-11/12">
      <h1 className='text-2xl text-black font-bold'>{gender.slice(0,1).toLocaleUpperCase()+gender.slice(1)} Fashion</h1>

    {
      data?.products?.length == 0 && <p className="text-center mt-40">No products found!</p>
    }
      <div className='mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-8'>
        {data.products?.map((item) => (
          <CardItem key={item._id} product={item} />
        ))}
      </div>
    </div>
  );
}
