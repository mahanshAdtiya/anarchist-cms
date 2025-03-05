import { format } from 'date-fns'
import { cookies } from 'next/headers'

import { formatter } from '@/lib/utils'
import { OrderClient } from './components/client'
import { OrderColumn } from './components/columns'
import { Order } from '@/utils/type'

const OrdersPage = async () => {
    const orders = await getOrders();

    const formattedOrders: OrderColumn[] = Array.isArray(orders) 
        ? orders.map((item) => ({
            id: item.id,
            phone: item.guestPhone || item.user?.phoneNumber || "N/A",
            address: item.shippingAddress
                ? `${item.shippingAddress.street || ''}, ${item.shippingAddress.city || ''}, ${item.shippingAddress.state || ''}, ${item.shippingAddress.zip || ''}`.trim()
                : "N/A",
            products: item.orderItems.map((orderItem) => orderItem.product.name).join(", "),
            totalAmount: formatter.format(
                item.orderItems.reduce(
                    (total, orderItem) =>
                        total + Number(orderItem.product.price), 
                    0
                )
            ),
            isPaid: item.isPaid,
            status: item.status, 
            createdAt: format(new Date(item.createdAt), "MMMM do, yyyy"),
        })) 
        : [];
    

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <OrderClient data={formattedOrders} />
            </div>
        </div>
    )
}

export default OrdersPage;

async function getOrders(): Promise<Order[] | null> {
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

    const jsonResponse = await res.json();

    if (!res.ok) {
      throw new Error(`Failed to fetch orders: ${res.statusText}`);
    }

    return jsonResponse?.data || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return null;
  }
}
