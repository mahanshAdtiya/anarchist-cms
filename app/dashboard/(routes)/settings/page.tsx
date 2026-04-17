export const dynamic = 'force-dynamic';

import { cookies } from "next/headers";
import { SettingsForm } from "./components/settings-form";

const SettingsPage = async () => {

    const user = await getUserDetails();

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <SettingsForm initialData={user} />
            </div>
        </div>
    )
}

export default SettingsPage

async function getUserDetails() {
    try{

        const cookieStore = cookies();
        const token = (await cookieStore).get("access_token")?.value;
    
        if (!token) {
            throw new Error("No access token found. User may not be logged in.");
        }
    
        const res = await fetch("http://localhost:8080/users/whoAmI", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            },
            cache: "no-cache",
        });
    
        const jsonResponse = await res.json();
    
        if (!res.ok) {
            throw new Error(`Failed to fetch billboards: ${res.statusText}`);
        }
    
        return jsonResponse?.data || [];

    }catch (error) {
        console.error("Error fetching User Details:", error);
        return null;
      }
}