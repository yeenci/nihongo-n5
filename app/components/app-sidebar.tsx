"use client";

import {
  Home,
  LogOut,
  ChartLine,
  BookText,
  Share2,
  BookmarkCheck,
  BadgeHelp,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  // SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import logo from "@/public/logo.png";

// Menu items.
const menu_items = [
  {
    title: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "All Lectures",
    href: "/dashboard/lectures",
    icon: BookText,
  },
  {
    title: "Progress",
    href: "/dashboard/progress",
    icon: ChartLine,
  },
  {
    title: "Shared Docs",
    href: "/dashboard/shared",
    icon: Share2,
  },
  {
    title: "Saved words",
    href: "/dashboard/saved",
    icon: BookmarkCheck,
  },
];

const footer_items = [
  {
    title: "Help Center",
    href: "/dashboard/progress",
    icon: BadgeHelp,
  },
  {
    title: "Settings",
    href: "/dashboard/shared",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-2 flex flex-row items-center !mt-0 !opacity-100">
        <Image src={logo} alt="Logo" width={30} height={30} />
        <span className="text-base group-data-[state=collapsed]:hidden">
          Nihongo N5
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu_items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ✅ SidebarFooter với Logout */}
      <SidebarFooter className="border-t">
        <SidebarMenu>
          {footer_items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.href}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-red-600 hover:bg-red-50"
        >
          <LogOut size={16} />
          <span className="group-data-[collapsible=icon]:hidden">Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
