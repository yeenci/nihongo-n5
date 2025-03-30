"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Loading from "../ui/loading";

const Dashboard = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md px-5 py-3 flex justify-between items-center">
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
