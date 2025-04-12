"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PawPrint } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 px-4 py-2 border-b bg-white shadow-sm flex items-center justify-between">
      <SidebarTrigger className="bg-sidebar hover:bg-sidebar text-opacity-70 absolute my-3 hover:opacity-100 -ml-8 z-50" />
      <h1 className="text-xl font-semibold text-cyan-900 flex gap-3">
        Nihongo N5 <PawPrint/>
      </h1>
      {/* You can add user info, logout button, dark mode toggle here */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="text-md text-cyan-600 hover:text-cyan-800"
          >
            こんにちは, Chi!
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 mr-4">
          <Separator />
          <Button variant="ghost" className="w-full justify-start my-1">
            ...
          </Button>
          <Separator />
          <Button
            variant="ghost"
            className="w-full justify-start  text-red-600 font-light hover:bg-red-50 my-1"
          >
            Delete Account
          </Button>
          <Separator />
        </PopoverContent>
      </Popover>
    </header>
  );
}
