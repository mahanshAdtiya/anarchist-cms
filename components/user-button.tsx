"use client";

import {useAuthStore} from "@/lib/store";
import { useState, useEffect } from "react";


function UserButton() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; 
  }
  console.log("WTF", user)

  return (
    <div className="ml-auto flex items-center space-x-4">
      <div className="bg-primary text-white rounded-full flex items-center justify-center m-2 p-4 w-10 h-10 cursor-pointer hover:bg-primary/80 transition duration-300">
        {user?.name?.charAt(0) || "MD"}
      </div>
    </div>
  );
}

export default UserButton;
