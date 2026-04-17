import { Order } from "@/utils/type";
import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";

interface GraphData {
    name: string;
    total: number;
}

export const getGraphRevenue = async () => {
    const paidOrders = await fetchOrder();
    const monthlyRevenue: { [key: number]: number } = {};

    for (const order of paidOrders) {
        const month = new Date(order.createdAt).getMonth();
        let revenueForOrder = 0;

        for (const item of order.orderItems) {
            revenueForOrder += Number(item.product.price);
        }

        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
    }

    const graphData: GraphData[] = [
        { name: 'Jan', total: 0 },
        { name: 'Feb', total: 0 },
        { name: 'Mar', total: 0 },
        { name: 'Apr', total: 0 },
        { name: 'May', total: 0 },
        { name: 'Jun', total: 0 },
        { name: 'Jul', total: 0 },
        { name: 'Aug', total: 0 },
        { name: 'Sep', total: 0 },
        { name: 'Oct', total: 0 },
        { name: 'Nov', total: 0 },
        { name: 'Dec', total: 0 }
    ];

    for (const month in monthlyRevenue) {
        graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
    }

    return graphData;
};


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
