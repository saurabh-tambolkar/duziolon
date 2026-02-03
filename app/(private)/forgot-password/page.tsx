'use client'
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Router } from 'next/router';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z, { email } from 'zod'

let forgotPassSchema = z.object({
    email:z.email(),
})

function page() {

      const form = useForm<z.infer<typeof forgotPassSchema>>({
        resolver: zodResolver(forgotPassSchema),
        defaultValues: {
          email: "",
        },
      });

      const [isSubmitting,setIsSubmitting] = useState(false)

      const router = useRouter();

       async function onSubmit(values: z.infer<typeof forgotPassSchema>) {
           //   login(values)
           try {
            setIsSubmitting(true)
            console.log(values);
            let response = await axios.post('api/forgot-password',values);
            if(response.data.success){
                toast.success(response.data.message)
                router.push('/')
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
    <div className='min-h-screen flex justify-center items-center'>
         <div className="w-full md:w-1/4 bg-gray-100 shadow-lg p-8 rounded-md border-2">
      <h1 className="text-black text-2xl font-bold text-center mb-8 ">Forgot Password</h1>
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
                <FormDescription>
                    You will receive an email with a link to reset your password.
                </FormDescription>
              </FormItem>
            )}
          />
          

          {/* <Link href={'/forgot-password'} className="text-xs text-gray-600 font-bold text-right">Forgot Password?</Link> */}

          {/* <Button type="submit" className="w-full bg-black hover:bg-gray-900 text-white">Login</Button> */}
          <Button type="submit" className="w-full bg-black hover:bg-gray-900 text-white" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              Please wait
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            'Submit'
          )}
        </Button>
          <p className="text-sm flex items-center justify-center gap-2">I remember my password? <Link href={'/sign-in'}  className="text-sm text-blue-500"> Sign In</Link></p> 
       
        </form>
      </Form>
      </div>
    </div>
  )
}

export default page