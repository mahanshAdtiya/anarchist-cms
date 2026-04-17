"use client"

import * as z from 'zod'

import { useState } from 'react'
import { Trash } from "lucide-react";
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { Heading } from '@/components/ui/Heading';
import { Separator } from "@/components/ui/separator";
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/mod/alert-modal';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Color } from '@/utils/type';
import { useAuthStore } from "@/lib/store";
import { API_URL } from "@/lib/api";

interface SettingsFromProps {
    initialData: Color | null; 
}

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(4).regex(/^#/, {
        message: 'String must be a valid hex code'
    }),
})

type ColorFormValues = z.infer<typeof formSchema>;

export const ColorForm: React.FC<SettingsFromProps> = ({ initialData }) => {

    const params = useParams();
    const router = useRouter();
    const { token } = useAuthStore(); 

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit color' : 'Create color'
    const description = initialData ? 'Edit a color' : 'Add a new color'
    const toastMessage = initialData ? 'Color updated.' : 'Color created.'
    const action = initialData ? 'Save changes' : 'Create'

    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        }
    });

  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true);

      if (!token) {
        throw new Error("No access token found. User may not be logged in.");
      }

      const url = initialData
        ? `${API_URL}/colors/${params.colorId}`
        : `${API_URL}/colors`;

      const method = initialData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`Failed to ${initialData ? "update" : "create"} Colors: ${res.statusText}`);
      }

      toast.success(toastMessage);
      router.refresh();
      router.push(`/dashboard/colors`);
    } catch (err) {
      console.error("Error submitting billboard:", err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      if (!token) {
        throw new Error("No access token found. User may not be logged in.");
      }

      const res = await fetch(`${API_URL}/colors/${params.colorId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        cache: "no-cache",
      });
  
      if (!res.ok) {
        throw new Error(`Failed to fetch Colors: ${res.statusText}`);
      }
      router.refresh();
      router.push(`/dashboard/colors`);
      toast.success("Billboard deleted.");
    } catch {
      toast.error("Make sure you removed all categories using this billboard first.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

    return (
        <>
            <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {initialData && (
                    <Button variant="destructive" size="sm" onClick={() => setOpen(true)} disabled={loading}>
                        <Trash className="w-4 h-4" />
                    </Button>
                )}
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
                                        <Input disabled={loading} placeholder='Color name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control} 
                            name="value"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <div className='flex items-center gap-x-4'>
                                            <Input disabled={loading} placeholder='Color value' {...field} />
                                            <div className='p-4 border rounded-full' style={{ backgroundColor: field.value }} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>{action}</Button>
                </form>
            </Form>
            {/* <Separator /> */}
        </>
    )
}