"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

import { ProductColumn, columns} from "./columns"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/Heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"

interface ProductClientProps {
    data: ProductColumn[]
}

export const ProductClient: React.FC<ProductClientProps> = ({data}) => {
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Products (${data?.length})`}
                    description="Manage products for your store"/>
                <Button onClick={() => router.push(`/dashboard/products/new`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name" />
            {/* <Heading title="API" description="API calls for Products" />
            <Separator />
            <ApiList entityName="products" entityIdName="productId" /> */}
        </>
    )
}