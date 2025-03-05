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

import { Size } from '@/utils/type';
import { useAuthStore } from "@/lib/store";

interface SettingsFromProps {
  initialData: Size | null; 
}

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
})

type SizeFormvalues = z.infer<typeof formSchema>;

export const SizeForm: React.FC<SettingsFromProps> = ({ initialData }) => {

    const params = useParams();
    const router = useRouter();
    const { token } = useAuthStore(); 

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit Size' : 'Create Size'
    const description = initialData ? 'Edit a Size' : 'Add a new size'
    const toastMessage = initialData ? 'Size updated.' : 'Size created.'
    const action = initialData ? 'Save changes' : 'Create'

    const form = useForm<SizeFormvalues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        }
    });

  const onSubmit = async (data: SizeFormvalues) => {
    try {
      setLoading(true);

      if (!token) {
        throw new Error("No access token found. User may not be logged in.");
      }

      const url = initialData
        ? `http://localhost:8080/sizes/${params.sizeId}`
        : `http://localhost:8080/sizes`;

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
        throw new Error(`Failed to ${initialData ? "update" : "create"} sizes: ${res.statusText}`);
      }

      toast.success(toastMessage);
      router.refresh();
      router.push(`/dashboard/sizes`);
    } catch (err) {
      console.error("Error submitting sizes:", err);
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

      const res = await fetch(`http://localhost:8080/sizes/${params.sizes}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        cache: "no-cache",
      });
  
    const jsonResponse = await res.json();
  
      if (!res.ok) {
        throw new Error(`Failed to fetch sizes: ${res.statusText}`);
      }
      router.refresh();
      router.push(`/dashboard/sizes`);
      toast.success("Billboard deleted.");
    } catch (err) {
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
                                  <Input disabled={loading} placeholder='Size name' {...field} />
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
                                  <Input disabled={loading} placeholder='Size value' {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
              </div>
              <Button disabled={loading} className='ml-auto' type='submit'>{action}</Button>
          </form>
      </Form>
    </>
  )
}