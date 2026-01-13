import { GetProductsDto, Product } from "@/utils/type";
import { cookies } from "next/headers";

export const getStockCount = async () => {
    const products = await fetchProducts();
    
    return products ? products.length : 0;
}

async function fetchProducts(filters: Partial<GetProductsDto> = {}): Promise<Product[]> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;

    if (!token) {
      throw new Error("No access token found. User may not be logged in.");
    }

    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => queryParams.append(key, v));
      } else if (value !== undefined) {
        if (typeof value === "boolean") {
          queryParams.append(key, value ? "true" : "false"); 
        } else if (value !== null) {
          queryParams.append(key, String(value));
        }
      }
    });

    const url = `http://localhost:8080/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      cache: "no-cache",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }

    const jsonResponse = await res.json();
    return jsonResponse?.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; 
  }
}
