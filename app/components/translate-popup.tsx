"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Languages } from "lucide-react";

export function TranslatePopup() {
  return (
    <div className="fixed bottom-12 right-6 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button className="rounded-full p-3 shadow-lg" variant="secondary">
            <Languages className="w-5 h-5"/>
          </Button>
        </PopoverTrigger>

        <PopoverContent align="center" className="w-64 mb-4 mr-6 bg-white border border-secondary rounded-md shadow-secondary p-4">
            <h4 className="font-semibold text-primary mb-2">Translate Tool</h4>
        </PopoverContent>
      </Popover>
    </div>
  );
}
