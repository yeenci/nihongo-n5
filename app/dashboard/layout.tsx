"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import Loading from "./loading";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=> {
        const timeout = setTimeout(() => setIsLoading(false), 800)
        return () => clearTimeout(timeout);
    }, []);

    if (isLoading) return <Loading/>

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
