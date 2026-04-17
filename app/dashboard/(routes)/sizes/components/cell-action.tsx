"use Client"

import { useState } from "react"
import { toast } from "react-hot-toast"
import { useRouter} from "next/navigation"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"

import { SizeColumn } from "./columns"
import { useAuthStore } from "@/lib/store"
import { API_URL } from "@/lib/api"

import { Button } from "@/components/ui/button"
import { AlertModal } from "@/components/mod/alert-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CellActionProps {
    data: SizeColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const router = useRouter();
    const { token } = useAuthStore(); 

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success('Color Id copied to the clipboard.')
    }

    const onDelete = async () => {
        try {
            setLoading(true);

            if (!token) {
              throw new Error("No access token found. User may not be logged in.");
            }

            const res = await fetch(`${API_URL}/sizes/${data.id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                cache: "no-cache",
              });
          
            const jsonResponse = await res.json();
        
            if (!res.ok) {
                throw new Error(`Failed to fetch Color: ${res.statusText}`);
            }

            router.refresh();
            toast.success("Color deleted successfully.")
        } catch {
            toast.error('Error deleting');
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal 
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}/>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-8 h-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Id
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/sizes/${data.id}`)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500" onClick={() => setOpen(true)}>
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}