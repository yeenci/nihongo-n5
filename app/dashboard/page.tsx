"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Icon library for menu
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Loading from "../ui/loading";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <Loading />
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg w-64 p-5 flex flex-col transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        } md:translate-x-0 md:w-64 fixed md:relative h-full z-50`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <button
            className="md:hidden p-2"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} className="" />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex flex-col space-y-4">
          <Link href="/dashboard" className="p-2 rounded-md hover:bg-gray-200">
            📊 Overview
          </Link>
          <Link
            href="/dashboard/profile"
            className="p-2 rounded-md hover:bg-gray-200"
          >
            👤 Profile
          </Link>
          <Link
            href="/dashboard/settings"
            className="p-2 rounded-md hover:bg-gray-200"
          >
            ⚙️ Settings
          </Link>
          <Link
            href="/login"
            onClick={() => auth.signOut().then(() => router.push("/login"))}
            className="p-2 rounded-md hover:bg-gray-200"
          >
            🚪 Logout
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md px-5 py-3 flex justify-between items-center">
          <button
            className="md:hidden p-2"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold">Welcome to Your Dashboard</h1>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
          <p className="text-gray-700">
            This is the main content area where you can display dashboard
            details.
          </p>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
