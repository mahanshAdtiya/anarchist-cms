import { cookies } from "next/headers";

import { BillBoard } from "@/utils/type";
import { API_URL } from "@/lib/api";
import { CategoryForm } from "./components/category-form";

const CategoryPage = async ({ params }: { params: Promise<{ categoryId: string }> }) => {
  const { categoryId } = await params;

  const category = await getcategorydData(categoryId); 

  const billboards =await getBillboards();

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  )
}

export default CategoryPage;

async function getcategorydData(categoryId: string) {
  if (categoryId === "new") {
    return null;
  }

  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;

    if (!token) {
      throw new Error("No access token found. User may not be logged in.");
    }

    const res = await fetch(`${API_URL}/categories/${categoryId}`, {
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
    console.error("Error fetching Category:", error);
    return null;
  }
}

async function getBillboards(): Promise<BillBoard[]> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;

    if (!token) {
      console.warn("No access token found. User may not be logged in.");
      return [];
    }

    const res = await fetch(`${API_URL}/billboards`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      cache: "no-cache",
    });

    const jsonResponse = await res.json();

    if (!res.ok) {
      throw new Error(`Failed to fetch billboards: ${res.statusText}`);
    }

    return jsonResponse?.data || [];
  } catch (error) {
    console.error("Error fetching billboards:", error);
    return []; 
  }
}
  