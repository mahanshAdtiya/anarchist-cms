import { Order } from "@/utils/type";
import { cookies } from "next/headers";

export const getSalesCount = async () => {
    const salesCount = await fetchOrder()

    return salesCount ? salesCount.length: 0;
}

async function fetchOrder(): Promise<Order[]> {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("access_token")?.value;

        if (!token) {
            throw new Error("No access token found. User may not be logged in.");
        }

        const res = await fetch("http://localhost:8080/orders", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            cache: "no-cache",
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch orders: ${res.statusText}`);
        }

        const jsonResponse = await res.json();
        return jsonResponse?.data || []; 
    } catch (error) {
        console.error("Error fetching orders:", error);
        return []; 
    }
}