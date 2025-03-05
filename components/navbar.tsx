import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import UserButton from "./user-button";
import { MainNav } from "@/components/main-nav";
import StoreName from "@/components/store-name";

async function Navbar() {
  const cookieStore = cookies();
  
  const token = (await cookieStore).get("access_token");
  
  
  if (!token) {
    redirect("/log-in");
  }
  return (
    <div className="border-b">
      <div className="h-16 flex items-center px-4">
        <StoreName />
        <MainNav className="mx-6"/>
        <UserButton />
      </div>
    </div>
  )
}

export default Navbar