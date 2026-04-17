import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/api";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const isLoginPage = req.nextUrl.pathname === "/log-in";

  if (token) {
    try {
      const response = await fetch(`${API_URL}/users/whoAmI`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        if (isLoginPage) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        return NextResponse.next();
      }
    } catch (error) {
      console.error("Middleware auth check failed:", error);
    }
  }

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/log-in", req.url));
  }

  return NextResponse.next(); 
}

export const config = {
  matcher: ["/dashboard/:path*", "/log-in"],
};
