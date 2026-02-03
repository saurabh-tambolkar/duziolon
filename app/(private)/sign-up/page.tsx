"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email:z.email(),
  name:z.string().min(2,{message:"Name must be at least 2 characters long"}),
  phone:z.string().min(10, { message: 'Must be a valid mobile number' })
    .max(10, { message: 'Must be a valid mobile number' }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

export default function Page() {

  const [isSubmitting,setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name:"",
      phone:"",
      password: "",
    },
  });


 const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sign-up`,values);
      if(response.data.success){
        localStorage.setItem("email",values.email)
        router.push('/verify-user')
        toast.success(response.data.message)
      }
    }
catch (error) {
  if (axios.isAxiosError(error)) {
    toast.error(error.response?.data?.message || "Something went wrong");
  } else {
    toast.error("Unexpected error occurred");
  }
}

    finally{
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-white flex justify-center items-center flex-col gap-5">
      <div className="w-full md:w-1/4 bg-gray-100 shadow-lg p-8 rounded-md mt-16 border-2">
      <h1 className="text-black text-2xl font-bold text-center mb-8 ">Sign Up</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
               <FormLabel className="text-black">Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
               <FormLabel className="text-black">Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
               <FormLabel className="text-black">Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isSubmitting} type="submit" className="w-full bg-black hover:bg-gray-900 text-white">
          {
          isSubmitting ?
          <>
           Please wait
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          </>
          :
          "Sign Up"
          }
          </Button>
          <p className="text-sm flex items-center justify-center gap-2">Already have an Account? <Link href={'/sign-in'}  className="text-sm text-blue-500"> Sign In</Link></p> 
        </form>
      </Form>
      </div>
    </div>
  );
}
