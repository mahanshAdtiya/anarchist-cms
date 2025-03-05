"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

import { BillboardColumn, columns} from "./columns"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/Heading"
import { ApiList } from "@/components/ui/api-list"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"

interface BillboardClientProps {
    data: BillboardColumn[]
}

export const BillboardClient: React.FC<BillboardClientProps> = ({
    data
}) => {
    const router = useRouter();
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Billboard (${data?.length})`}
                    description="Manage billboards for your store"/>
                <Button onClick={() => router.push(`/dashboard/billboards/new`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="label" />
            {/* <Heading title="API" description="API calls for Billboards" />
            <Separator />
            <ApiList entityName="billboards" entityIdName="billboardId" /> */}
        </>
    )
}