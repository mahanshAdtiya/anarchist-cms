import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const cookieStore = cookies();

  const token = (await cookieStore).get("access_token");

  if (!token) {
    redirect("/log-in");
  }
  redirect("/dashboard");
}