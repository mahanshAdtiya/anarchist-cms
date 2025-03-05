import React from 'react';
import { Store } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';

interface StoreNameProps {
  className?: string;
}

const StoreName: React.FC<StoreNameProps> = ({ className }) => {
  return (
    <Button 
        variant="outline"
        size="sm"
        role="combobox"
        aria-label="Select a Store"
        className={cn("w-[200px] justify-between", className)}
    >
        <Store className="mr-2 h-4 w-4"/>
        Anarchist
    </Button>
  );
}

export default StoreName;
