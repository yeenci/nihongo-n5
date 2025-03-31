"use client";

import { Calendar, Home, Inbox, Search, Settings, LogOut, ChevronRight, ChevronLeft } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";
import clsx from "clsx";

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Sidebar
      className={`relative transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
    >
      <button
        onClick={() => {
          setCollapsed(!collapsed);
        }}
        className={clsx(
          "absolute -right-3 top-4 z-10 bg-white border rounded-full p-1 shadow",
          "transition-transform duration-300",
          collapsed ? "rotate-180" : ""
        )}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}</button>
      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Application</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      {!collapsed && <span>{item.title}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ✅ SidebarFooter với Logout */}
      <SidebarFooter className="border-t p-4">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-red-600 hover:bg-red-50"
        >
          <LogOut size={16} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
