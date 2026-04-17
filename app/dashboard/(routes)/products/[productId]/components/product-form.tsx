"use client"

import * as z from 'zod'

import { useState, useEffect} from 'react'
import { ChevronDown, Trash } from "lucide-react";
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';


import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { Heading } from '@/components/ui/Heading';
import { Separator } from "@/components/ui/separator";
import { zodResolver } from '@hookform/resolvers/zod';
import ImageUpload from '@/components/ui/image-upload';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertModal } from '@/components/mod/alert-modal';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useAuthStore } from '@/lib/store';
import { API_URL } from '@/lib/api';
import { Category, Color, Image, Product, Size } from '@/utils/type';


interface ProductFromProps {
    initialData: Product & {
        images: Image[]
    } | null;
    categories: Category[]
    colors: Color[]
    sizes: Size[]
}

const formSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    images: z.object({ url: z.string() }).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeIds: z.array(z.string()).nonempty(),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional()
});

type ProductFormValues = z.infer<typeof formSchema>;

export const ProductForm: React.FC<ProductFromProps> = ({
    initialData,
    categories,
    colors,
    sizes
}) => {

    const params = useParams();
    const router = useRouter();
    const { token } = useAuthStore(); 
    

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit product' : 'Create product'
    const description = initialData ? 'Edit a product' : 'Add a new product'
    const toastMessage = initialData ? 'Product updated.' : 'Product created.'
    const action = initialData ? 'Save changes' : 'Create'

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? {
                name: initialData.name,
                description: initialData.description || "",
                images: initialData.images.map(img => ({ url: img.url })), 
                price: parseFloat(String(initialData.price)),
                isArchived: initialData.isArchived || false,
                isFeatured: initialData.isFeatured || false,
                categoryId: initialData.category?.id || '',
                colorId: initialData.color?.id || '',
                sizeIds: initialData.sizes?.map(s => s.size.id) || []
            }
            : {
                name: '',
                description: '',
                images: [],
                price: 0,
                isFeatured: false,
                isArchived: false,
                categoryId: '',
                colorId: '',
                sizeIds: [],
            }
    });

    const [images, setImages] = useState<{ url: string }[]>(
        initialData?.images.map((i) => ({ url: i.url })) ?? []
    )
    useEffect(() => {
        form.setValue("images", images)
    }, [images])
 

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true);

            if (!token) {
                throw new Error("No access token found. User may not be logged in.");
            }

            const url = initialData
                ? `${API_URL}/products/${params.productId}`
                : `${API_URL}/products`;

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
                throw new Error(`Failed to ${initialData ? "update" : "create"} products: ${res.statusText}`);
            }

            router.refresh();
            router.push(`/dashboard/products`);
            toast.success(toastMessage)
        } catch(err) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            
            if (!token) {
                throw new Error("No access token found. User may not be logged in.");
            }

            const res = await fetch(`${API_URL}/products/${params.productId}`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
                },
                cache: "no-cache",
            });
        
            const jsonResponse = await res.json();
        
            if (!res.ok) {
                throw new Error(`Failed to fetch products: ${res.statusText}`);
            }

            router.refresh();
            router.push(`/dashboard/products`)
            toast.success("Product deleted.")
        } catch(err) {
            toast.error("Something Went Wrong.");
        } finally {
            setLoading(false)
            setOpen(false);
        }
    }

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
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => {
                            return (
                            <FormItem>
                                <FormLabel>Product Images</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={images}
                                        disabled={loading}
                                        onAdd={(image) => setImages((prev) => [...prev, image])}
                                        onRemove={(url) => setImages((prev) => prev.filter((img) => img.url !== url))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            );
                        }}
                    />
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control} 
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Product Name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control} 
                            name="price"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder='Product Price' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control} 
                            name="categoryId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder='Select a Category'
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map(category => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sizeIds"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Sizes</FormLabel>
                                    <Popover >
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-between">
                                                {field.value.length > 0
                                                ? sizes
                                                    .filter((size) => field.value.includes(size.id))
                                                    .map((size) => size.name)
                                                    .join(", ")
                                                : "Select sizes"}
                                                <ChevronDown className="w-4 h-4 ml-2 opacity-70" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[30vw] p-2 shadow-lg border rounded-md bg-white">
                                            <ScrollArea className="h-48">
                                                {sizes.map((size) => (
                                                <div key={size.id} className="flex items-center space-x-2 py-1">
                                                    <Checkbox
                                                    checked={field.value.includes(size.id)}
                                                    onCheckedChange={(checked) => {
                                                        field.onChange(
                                                        checked
                                                            ? [...field.value, size.id]
                                                            : field.value.filter((id) => id !== size.id)
                                                        );
                                                    }}
                                                    />
                                                    <span className="text-sm">{size.name}</span>
                                                </div>
                                                ))}
                                            </ScrollArea>
                                        </PopoverContent>
                                    </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control} 
                            name="colorId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder='Select a color'
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {colors.map(color => (
                                                <SelectItem style={{ display: 'flex' }} key={color.id} value={color.id}>
                                                    <span style={{ color: color.value }}>{color.name}</span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control} 
                            name="isFeatured"
                            render={({field}) => (
                                <FormItem className='flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md'>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className='space-y-1 leading-none'>
                                        <FormLabel>
                                            Featured
                                        </FormLabel>
                                        <FormDescription>
                                            The product will appear on the home page.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control} 
                            name="isArchived"
                            render={({field}) => (
                                <FormItem className='flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md'>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className='space-y-1 leading-none'>
                                        <FormLabel>
                                            Archived
                                        </FormLabel>
                                        <FormDescription>
                                            The product will not appear anywhere in the store.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Product Description' {...field} />
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