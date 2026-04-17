import { format} from "date-fns"
import { cookies } from "next/headers"
import { API_URL } from "@/lib/api"

import { formatter } from '@/lib/utils'
import { ProductClient } from './components/client'
import { ProductColumn } from './components/columns'
import { GetProductsDto, Product } from "@/utils/type"

const ProductsPage = async () => {
  const filters = { isFeatured: true }; 
  const products = await getProducts(filters);

  const formattedProducts: ProductColumn[] = products 
  ? products.map(item => ({
      id: item.id,
      name: item.name,
      isFeatured: item.isFeatured,
      isArchived: item.isArchived,
      price: formatter.format(Number(item.price)),
      category: item.category.name,
      color: item.color.value,
      sizes: item.sizes.map(s => s.size.value),
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }))
  : [];

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;


async function getProducts(filters: Partial<GetProductsDto> = {}): Promise<Product[] | null> {
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

    const url = `${API_URL}/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

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
    return null;
  }
}
