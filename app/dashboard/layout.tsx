import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Navbar from "@/components/navbar";
import AuthChecker from "@/components/AuthChecker";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token");

  if (!token) {
    redirect("/log-in");
  }

  return (
    <AuthChecker>
      <Navbar/>
      {children}
    </AuthChecker>
  );
}