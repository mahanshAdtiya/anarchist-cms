import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AuthChecker from "@/components/AuthChecker";

export default async function SetupLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token");

  if (!token) {
    redirect("/log-in");
  }

  return <AuthChecker>{children}</AuthChecker>;
}