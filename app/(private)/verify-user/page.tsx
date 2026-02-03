"use client";   // <-- ADD THIS LINE

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner';
import z from 'zod'

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

function Page() {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })

  const [isSubmitting,setIsSubmitting] = useState(false);
  const router = useRouter();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
    try {
      setIsSubmitting(true)
       const email = localStorage.getItem("email");
      let dataToSend = {
        email,
        verifyCode:data.pin
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/verify-user`,dataToSend)
      if(response.data.success){
        toast.success(response.data.message)
        localStorage.removeItem('email')
        router.push('/sign-in')
      }
      console.log(dataToSend)
    }catch (error) {
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
        <h1 className="text-black text-2xl font-bold text-center mb-8">Verify with OTP</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the one-time password sent to your mail.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ?
                <>
                Please wait <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </>
                :
                "Submit"
              }
              </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Page
