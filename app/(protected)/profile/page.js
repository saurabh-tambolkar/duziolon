"use client";
import React, { useState } from "react";
import ProfilerForm from "@/components/ProfilerForm";
import { CreditCard, MapPinHouse, Ticket, User2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

function page() {
  const profileLinks = [
    {
      name: "Personal Information",
      form: "profile",
      icon: <User2 className="h-5 w-5" />,
    },
    {
      name: "Addresses",
      form: "address",
      icon: <MapPinHouse className="h-5 w-5" />,
    },
    {
      name: "Tickets",
      form: "tickets",
      icon: <Ticket className="h-5 w-5" />,
    },
    {
      name: "Payment Methods",
      form: "payment",
      icon: <CreditCard className="h-5 w-5" />,
    },
  ];

  const searchParams = useSearchParams();
  let activeTab = searchParams.get("tab") || "profile";

  const [activeForm, setActiveForm] = useState(activeTab);
  const router = useRouter();

  const handleTabChange = (tab) => {
    router.push(`/profile?tab=${tab}`);
    setActiveForm(tab);
  };

  return (
    <div className="min-h-screen flex pt-24 md:mx-12 rounded">
      <div className="w-18 md:w-72 border bg-gray-100 rounded p-2 md:p-4">
        {profileLinks.map((link) => (
          <div
            key={link.form}
            // onClick={() => setActiveForm(link.form)}
            onClick={() => handleTabChange(link.form)}
            className={`flex items-center justify-center md:justify-start gap-3 p-3 my-2 rounded-lg cursor-pointer transition-all
        ${
          activeForm === link.form ? "bg-black text-white" : "hover:bg-gray-300"
        }`}
          >
            {link.icon}

            <span className="hidden md:block font-medium">{link.name}</span>
          </div>
        ))}
      </div>
      <div className="w-full border rounded p-4">
        <ProfilerForm activeForm={activeForm} />
      </div>
    </div>
  );
}

export default page;
