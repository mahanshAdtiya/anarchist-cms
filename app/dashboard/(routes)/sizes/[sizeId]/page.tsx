import { cookies } from "next/headers";
import { SizeForm } from "./components/size-form";
import { API_URL } from "@/lib/api";

const SizePage = async ({ params }: { params: Promise<{ sizeId: string }> }) => {
    const { sizeId } = await params
    const size = await getSizeData(sizeId)

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <SizeForm initialData={size} />
            </div>
        </div>
    )
}

async function getSizeData(colorId: string) {
    if (colorId === "new") {
      return null;
    }
  
    try {
      const cookieStore = cookies();
      const token = (await cookieStore).get("access_token")?.value;
  
      if (!token) {
        throw new Error("No access token found. User may not be logged in.");
      }
  
      const res = await fetch(`${API_URL}/sizes/${colorId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        cache: "no-cache",
      });
  
      const jsonResponse = await res.json();

      if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.statusText}`);
      }

      return jsonResponse?.data || []; 
      
    } catch (error) {
      console.error("Error fetching Colors:", error);
      return null;
    }
  }

export default SizePage;