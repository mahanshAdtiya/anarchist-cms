import { cookies } from "next/headers";
import { BillboardForm } from "./components/billboard-form";

const BillboardPage = async ({ params }: { params: { billboardId: string } }) => {
  const { billboardId } = await params;

  const initialData = await getBillboardData(billboardId); 

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <BillboardForm initialData={initialData} />
      </div>
    </div>
  );
};

async function getBillboardData(billboardId: string) {
  if (billboardId === "new") {
    return null;
  }

  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;

    if (!token) {
      throw new Error("No access token found. User may not be logged in.");
    }

    const res = await fetch(`http://localhost:8080/billboards/${billboardId}`, {
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
    console.error("Error fetching billboard:", error);
    return null;
  }
}

export default BillboardPage;
