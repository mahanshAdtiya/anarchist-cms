import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { API_URL } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: (user, token) => {
        Cookies.set("access_token", token, { expires: 7 });
        set({ user, token });
      },

      logout: () => {
        Cookies.remove("access_token");
        set({ user: null, token: null });
      },

      checkAuth: async () => {
        const token = Cookies.get("access_token");

        if (!token) {
          get().logout();
          return;
        }

        try {
          const response = await fetch(`${API_URL}/users/whoAmI`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) {
            get().logout();
            return;
          }

          const data = await response.json();
          set({ user: data.data, token }); 
        } catch (error) {
          console.error("Auth check failed:", error);
          get().logout();
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

