import { format} from "date-fns"

import { cookies } from "next/headers";

import { Size } from "@/utils/type";
import { SizeClient } from './components/client'
import { SizeColumn } from './components/columns'

const SizesPage = async () => {
  const sizes = await getSizes();

  const formattedColors: SizeColumn[] =  Array.isArray(sizes)
  ? sizes.map(item => ({
      id: item.id,
      name: item.name,
      value: item.value,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
      }))
  : []

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <SizeClient data={formattedColors} />
      </div>
    </div>
  )
}

async function getSizes(): Promise<Size[] | null> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;

    if (!token) {
      throw new Error("No access token found. User may not be logged in.");
    }

    const res = await fetch("http://localhost:8080/sizes", {
      method: "GET",
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
    
    return jsonResponse?.data || [];
  } catch (error) {
    console.error("Error fetching sizes:", error);
    return null;
  }
}
export default SizesPage;