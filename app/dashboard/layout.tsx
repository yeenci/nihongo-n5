"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import React, { useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import Loading from "./loading";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (loading || !user) {
    return <Loading />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <AnimatePresence>
          <motion.main
            key="dashboard"
            className="flex-1 "
          >
            {/* <SidebarTrigger className="fixed"/> */}
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </SidebarProvider>
  );
}
