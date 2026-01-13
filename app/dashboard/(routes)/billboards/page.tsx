import { format} from "date-fns"

import { BillBoard } from "@/utils/type";
import { BillboardClient } from './components/client';
import { BillboardColumn } from './components/columns';

const BillboardsPage = async () => {

  const billboard = await getBillboards();

  const formattedBillboards: BillboardColumn[] = Array.isArray(billboard)
  ? billboard.map(item => ({
      id: item.id,
      label: item.label,
      imageUrl: item.imageUrl,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    }))
  : [];
  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

async function getBillboards(): Promise<BillBoard[] | null> {
  try {
    
    const res = await fetch("http://localhost:8080/billboards", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
    return null;
  }
}


export default BillboardsPage;