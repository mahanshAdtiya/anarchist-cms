"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

import { SizeColumn, columns} from "./columns"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/Heading"
import { ApiList } from "@/components/ui/api-list"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"

interface SizeClientProps {
    data: SizeColumn[]
}

export const SizeClient: React.FC<SizeClientProps> = ({
    data
}) => {
    const router = useRouter();
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Sizes (${data?.length})`}
                    description="Manage Sizes for your store"/>
                <Button onClick={() => router.push(`/dashboard/sizes/new`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name" />
            {/* <Heading title="API" description="API calls for Sizes" />
            <Separator />
            <ApiList entityName="Sizes" entityIdName="SizeId" /> */}
        </>
    )
}