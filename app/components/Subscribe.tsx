"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import React, { useRef, useState } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"

interface SubscribeResponse {
  error: string;
}

const FormSchema = z.object({
    email: z.string().min(5, {
      message: "Email must be at least 5 characters.",
    }),
})

export default function Subscribe() {

    const subscribe = async (email: string) => {
        const res = await fetch('/api/subscribe', {
        body: JSON.stringify({
            email: email,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        });

        const { error } = await res.json() as SubscribeResponse;
    };

    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
    })
   
    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data)
        toast({
            title: "You submitted the following values:",
            description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-black">{JSON.stringify(data, null, 2)}</code>
            </pre>
            ),
        })
        subscribe(data['email'])
    }
   
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full max-w-sm items-center space-x-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl className="text-black">
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Subscribe</Button>
        </form>
      </Form>
    )
  }

// export default function Subscribe() {
//   const inputEl = useRef<HTMLInputElement | null>(null);
//   const [message, setMessage] = useState<string>('');

//   const subscribe = async (e: any) => {

//     console.log(inputEl)

//     // if (!inputEl.current) {
//     //   return;
//     // }

//     const res = await fetch('/api/subscribe', {
//       body: JSON.stringify({
//         email: inputEl.current.value,
//       }),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       method: 'POST',
//     });

//     const { error } = await res.json() as SubscribeResponse;

//     if (error) {
//       setMessage(error);
//     }

//     inputEl.current.value = '';
//     setMessage('Success! 🎉 You are now subscribed to the newsletter.');
//   };

//   return (
//     <form onSubmit={subscribe} className="flex w-full max-w-sm items-center space-x-2">
//       <Input type="email" placeholder="Email" />
//       <Button type="submit">Subscribe</Button>
//     </form>
//   );
// }
