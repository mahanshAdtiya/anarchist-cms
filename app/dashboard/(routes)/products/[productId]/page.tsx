import { cookies } from "next/headers";

import { ProductForm } from "./components/product-form";
import { API_URL } from "@/lib/api";
import { Category, Color, Size } from "@/utils/type";

const ProductPage = async ({ params }: { params: Promise<{ productId: string}> }) => {
    const { productId } = await params;
    const product = await getProductData(productId)

    const categories = await getCategories()

    const sizes = await getSizes()

    const colors = await getColors();

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <ProductForm
                    initialData={product}
                    colors={colors}
                    sizes={sizes}
                    categories={categories}
                />
            </div>
        </div>
    )
}

export default ProductPage;

async function getProductData(productId:string) {
    if (productId === "new") {
        return null;
      }
    
      try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("access_token")?.value;
    
        if (!token) {
          throw new Error("No access token found. User may not be logged in.");
        }
    
        const res = await fetch(`${API_URL}/products/${productId}`, {
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
        console.error("Error fetching products:", error);
        return null;
      }
}

async function getCategories(): Promise<Category[]> {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("access_token")?.value;

        if (!token) {
        console.error("No access token found. User may not be logged in.");
        return []; 
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
        return []; 
    }
}
  
async function getColors(): Promise<Color[]> {
try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;

    if (!token) {
    console.error("No access token found. User may not be logged in.");
    return [];
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
    return [];
}
}

async function getSizes(): Promise<Size[]> {
try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;

    if (!token) {
    console.error("No access token found. User may not be logged in.");
    return [];
    }

    const res = await fetch(`${API_URL}/sizes`, {
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
    return [];
}
}
  