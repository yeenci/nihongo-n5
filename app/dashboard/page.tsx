"use client";

import React, {  } from "react";

const Dashboard = () => {

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
