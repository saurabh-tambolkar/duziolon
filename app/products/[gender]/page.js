import CardItem from "../../../components/CardItem";

export const revalidate = 60; // cache for 60 seconds

export default async function Page({params}) {
  let {gender} = await params;
  console.log("this is gender here ",gender)
  console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/products/${gender}`,
    {
      method: "POST",
      cache: "no-cache",
    }
  );
  const data = await res.json();

  return (
    <div className="min-h-screen pt-30 mx-auto w-11/12">
      <h1 className='text-2xl text-black font-bold'>{gender.slice(0,1).toLocaleUpperCase()+gender.slice(1)} Fashion</h1>

    {
      data?.products?.length == 0 && <p className="text-center mt-40">No products found!</p>
    }
      <div className='mt-12 grid grid-cols-1 md:grid-cols-4 gap-8'>
        {data.products?.map((item) => (
          <CardItem key={item._id} product={item} />
        ))}
      </div>
    </div>
  );
}
