"use client";

import { z } from "zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { User } from "@/utils/type";
import { useAuthStore } from "@/lib/store";

interface SettingsFormsProps{
    initialData: User;
}
const formSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(), 
  });
  
  type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormsProps> = ({ initialData }) => {
    const router = useRouter();
    const { token } = useAuthStore(); 

    const [loading, setLoading] = useState(false);
    
    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: initialData.name,
          email: initialData.email, 
        },
      });
    const onSubmit = async (data: SettingsFormValues) => {
        try {
            setLoading(true);

            if (!token) {
                throw new Error("No access token found. User may not be logged in.");
            }


            const res = await fetch('http://localhost:8080/users', {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify(data),
            });

            if (!res.ok) {
            throw new Error(`Failed to ${initialData ? "update" : "create"} billboard: ${res.statusText}`);
            }
            router.refresh();
            toast.success("Details updated.")
        } catch(err) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title="Settings" description="Manage your details" />
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control} 
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Your name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        <FormField
                            control={form.control} 
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Email ID' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>Save Changes</Button>
                </form>
            </Form>
        </>
  )
}
