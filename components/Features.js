import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Truck,
      title: "Free Delivery",
      description: "Free shipping on all orders above ₹999.",
    },
    {
      icon: RotateCcw,
      title: "30-Day Returns",
      description: "Easy returns and exchanges within 30 days.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      description: "100% secure checkout with trusted payment gateways.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Our team is always here to help you.",
    },
  ];

  return (
    <section className=" px-0 md:px-4my-12 md:pt-12" >
        <h1 className='text-3xl font-bold text-center'>What We Offer</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-4" style={{ backgroundColor: "#fcf6f1" }}>
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <div key={index} className="flex items-center justify-center border-r-2 p-4 gap-2">
              <div className="w-14 h-14 rounded-full flex items-center justify-center">
                <Icon className="w-7 h-7 text-black group-hover:text-white transition-colors" />
              </div>
              <div>
              <h3 className="font-semibold text-lg">
                {feature.title}
              </h3>

              <p className="text-gray-500 text-xs">
                {feature.description}
              </p>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}