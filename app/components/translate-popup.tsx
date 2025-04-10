"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Languages, PawPrint } from "lucide-react";

export function TranslatePopup() {
  return (
    <div className="fixed bottom-12 right-6 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button className="rounded-full p-3 shadow-lg " variant="secondary">
            <Languages className="w-5 h-5" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="center"
          className="w-64 mb-4 mr-6 bg-white border border-secondary rounded-md shadow-secondary p-4"
        >
          <h3 className="font-semibold text-primary flex justify-between">
            Meowlate
            <PawPrint />
          </h3>
          <h6 className="text-xs mb-2 text-gray-400">
            Translate from JP to EN
          </h6>
          <textarea className="w-full border-2 rounded-md resize-none text-xs p-2" rows={1} placeholder="Enter JP word:"/>
          {/* <div className="h-12 border"></div> */}
        </PopoverContent>
      </Popover>
    </div>
  );
}
