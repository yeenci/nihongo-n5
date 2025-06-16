// src/components/Header.tsx

"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PawPrint, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import SimpleAvatar, {
  capitalizeName,
  getInitials,
  getNameFromEmail,
} from "./comment-helper";

export function Header() {
  const { user, logout } = useAuth();

  const name = user ? getNameFromEmail(user.email) : "";
  const capitalizedName = capitalizeName(name);

  

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 px-4 py-2 border-b bg-white shadow-sm flex items-center justify-between">
      <SidebarTrigger className="bg-sidebar hover:bg-sidebar text-opacity-70 absolute my-3 hover:opacity-100 -ml-4 md:-ml-8 z-50" />
      <Link
        href="/"
        className="text-xl font-semibold text-cyan-900 flex gap-3 ml-6 md:ml-0 items-center"
      >
        Nihongo N5 <PawPrint />
      </Link>

      {user ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="text-md text-cyan-600 hover:text-cyan-800"
            >
              {`こんにちは, ${capitalizedName}!`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 mr-4 p-2">
            <div className="flex flex-col gap-1">
              {/* 1. Profile Button */}
              <Link href="/person/edit-profile" passHref>
                <Button
                  variant="ghost"
                  className="w-full h-auto justify-start p-2"
                >
                  <div className="flex items-center gap-3">
                    <SimpleAvatar initials={getInitials(user.email)} />
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">{capitalizedName}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </Button>
              </Link>

              <Separator />

              {/* 2. Dashboard Button */}
              <Link href="/person/manage-posts" passHref>
                <Button variant="ghost" className="w-full justify-start">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  My Posts
                </Button>
              </Link>

              <Separator />

              {/* 3. Logout Button */}
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        // --- LOGGED-OUT STATE: LOGIN BUTTON ---
        <Link href="/login" passHref>
          <Button variant="outline">Login</Button>
        </Link>
      )}
    </header>
  );
}
