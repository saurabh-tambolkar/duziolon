"use client";

import React from "react";
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
import { useUser } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email:z.email(),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

export default function Page() {


  const {login,isSubmitting} = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    login(values)
  }

  return (
    <div className="min-h-screen p-8 bg-white flex justify-center items-center flex-col gap-5">
      <div className="w-full md:w-1/4 bg-gray-100 shadow-lg p-8 rounded-md border-2">
      <h1 className="text-black text-2xl font-bold text-center mb-8 ">Sign In</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="ml-auto">
          <Link href={'/forgot-password'} className="text-xs text-gray-600 font-bold w-full mb-8 text-center">Forgot Password?</Link>
          </div>

          {/* <Button type="submit" className="w-full bg-black hover:bg-gray-900 text-white">Login</Button> */}
          <Button type="submit" className="w-full bg-black hover:bg-gray-900 text-white" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              Please wait
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            'Sign In'
          )}
        </Button>
          <p className="text-sm flex items-center justify-center gap-2">Dont have an Account? <Link href={'/sign-up'}  className="text-sm text-blue-500"> Sign Up</Link></p> 
       
        </form>
      </Form>
      </div>
    </div>
  );
}
