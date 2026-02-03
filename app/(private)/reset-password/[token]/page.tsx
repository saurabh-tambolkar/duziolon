"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z
  .object({
    password: z.string().min(2, {
      message: "Password must be at least 2 characters.",
    }),
    confirmPassword: z.string().min(2, {
      message: "Confirm Password must be at least 2 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // error will appear under confirmPassword field
  });



export default function Page() {
  const params = useParams();
  const token = params.token;

  const [isSubmitting,setIsSubmitting] = useState(false)

  console.log("Token:", token);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    try {
        let dataToSend = {
            password:values.password,token
        }
        console.log(dataToSend)
        setIsSubmitting(true)
        let response = await axios.post('/api/reset-password',dataToSend);
        if(response.data.success){
            toast.success(response.data.message);
            router.push('/sign-in')
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
      <div className="w-full md:w-1/4 bg-gray-100 shadow-lg p-8 rounded-md border-2">
      <h1 className="text-black text-2xl font-bold text-center mb-8 ">Reset Password</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="Confirm Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          {/* <Button type="submit" className="w-full bg-black hover:bg-gray-900 text-white">Login</Button> */}
          <Button type="submit" className="w-full bg-black hover:bg-gray-900 text-white" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              Please wait
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            'Reset Password'
          )}
        </Button>
          
        </form>
      </Form>
      </div>
    </div>
  );
}
