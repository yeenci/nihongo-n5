"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
// import { SidebarProvider } from "@/components/ui/sidebar";
import React, { useEffect } from "react";
import { AppSidebar } from "@/app/components/app-sidebar";
import Loading from "./loading";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <Loading />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1">
            {/* <SidebarTrigger className="bg-sidebar hover:bg-sidebar text-opacity-70 absolute my-3 hover:opacity-100 -ml-4 z-50" /> */}
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
