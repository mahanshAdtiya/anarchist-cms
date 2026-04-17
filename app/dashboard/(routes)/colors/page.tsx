export const dynamic = 'force-dynamic';

import { format} from "date-fns"

import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";

import { Color } from "@/utils/type";
import { ColorClient } from './components/client'
import { ColorColumn } from './components/columns'

const ColorsPage = async () => {
  const colors = await getColors();

  const formattedColors: ColorColumn[] =  Array.isArray(colors)
  ? colors.map(item => ({
      id: item.id,
      name: item.name,
      value: item.value,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
      }))
  : []

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ColorClient data={formattedColors} />
      </div>
    </div>
  )
}

async function getColors(): Promise<Color[] | null> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;

    if (!token) {
      throw new Error("No access token found. User may not be logged in.");
    }

    const res = await fetch(`${API_URL}/colors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      cache: "no-cache",
    });

    const jsonResponse = await res.json();

    if (!res.ok) {
      throw new Error(`Failed to fetch Colors: ${res.statusText}`);
    }
    
    return jsonResponse?.data || [];
  } catch (error) {
    console.error("Error fetching Colors:", error);
    return null;
  }
}
export default ColorsPage;