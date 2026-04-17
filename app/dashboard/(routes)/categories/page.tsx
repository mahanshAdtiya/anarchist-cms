export const dynamic = 'force-dynamic';

import { format } from 'date-fns'
import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";

import { Category } from '@/utils/type';
import { CategoryClient } from './components/client'
import { CategoryColumn } from './components/columns'

const CategoriesPage = async () => {
  const categories = await getAllCategories();

  const formattedCategories: CategoryColumn[] =  Array.isArray(categories)
  ? categories.map((item) => ({
      id: item.id,
      name: item.name,
      billboardLabel: item.billboard?.label || "No Billboard",
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }))
  : []; 


  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

async function getAllCategories(): Promise<Category[] | null> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;

    if (!token) {
      throw new Error("No access token found. User may not be logged in.");
    }

    const res = await fetch(`${API_URL}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      cache: "no-cache",
    });

    const jsonResponse = await res.json();

    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.statusText}`);
    }

    return jsonResponse?.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
}

export default CategoriesPage;
