"use client";

import {
  Home,
  LogOut,
  ChartLine,
  Library,
  Share2,
  BookmarkCheck,
  BadgeHelp,
  Settings,
  BookA,
} from "lucide-react";

import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import logo from "@/public/logo.png";
import { usePathname } from "next/navigation";
import ResponsiveSidebar from "./responsive-sidebar";

// Menu items.
const menu_items = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Alphabets",
    href: "/alphabets",
    icon: BookA,
  },
  {
    title: "All Lectures",
    href: "/lectures",
    icon: Library,
  },
  {
    title: "Progress",
    href: "/progress",
    icon: ChartLine,
  },
  {
    title: "Resources",
    href: "/resources",
    icon: Share2,
  },
  {
    title: "Saved Words",
    href: "/words",
    icon: BookmarkCheck,
  },
];

const footer_items = [
  {
    title: "Help Center",
    href: "/progress",
    icon: BadgeHelp,
  },
  {
    title: "Settings",
    href: "/shared",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <ResponsiveSidebar collapsible="icon">
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
              {menu_items.map((item) => {
                const isActive = pathname.startsWith(item.href + "/") || pathname === item.href;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`${
                        isActive
                          ? "bg-sidebar-accent text-primary font-semibold"
                          : "hover:bg-sidebar-accent"
                      } py-4  my-0.5`}
                    >
                      <a href={item.href}>
                        <item.icon />
                        <span className="text-base">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
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
    </ResponsiveSidebar>
  );
}
