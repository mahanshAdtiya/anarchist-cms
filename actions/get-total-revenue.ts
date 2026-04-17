import { Order } from "@/utils/type";
import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";

export const getTotalRevenue = async () => {
    const paidOrders = await fetchOrder();

    const totalRevenue = paidOrders.reduce((total, order) => {
        const orderTotal = order.orderItems.reduce((orderSum, item) => {
            return orderSum + Number(item.product.price);
        }, 0);
        return total + orderTotal;
    }, 0);

    return totalRevenue;
}
async function fetchOrder(): Promise<Order[]> {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("access_token")?.value;

        if (!token) {
            throw new Error("No access token found. User may not be logged in.");
        }

        const res = await fetch(`${API_URL}/orders`, {
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
        return jsonResponse?.data || []; // Ensure it's an array
    } catch (error) {
        console.error("Error fetching orders:", error);
        return []; // Return an empty array instead of null
    }
}