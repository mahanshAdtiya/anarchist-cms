"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";

export default function AuthChecker({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}
