"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export function Header() {
  return (
    <header className="w-full px-4 py-3 border-b bg-white shadow-sm flex items-center justify-between">
      <h1 className="text-xl font-semibold">Welcome to Nihongo N5</h1>
      {/* You can add user info, logout button, dark mode toggle here */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="text-md text-gray-500">
            こんにちは, Chi!
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-4 mr-4">
          <Separator />
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 my-1"
          >
            ...
          </Button>
          <Separator />
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 my-1"
          >
            Delete Account
          </Button>
          <Separator />
        </PopoverContent>
      </Popover>
    </header>
  );
}
