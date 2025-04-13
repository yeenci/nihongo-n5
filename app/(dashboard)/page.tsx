"use client";

import { useAutoFetchImages } from "@/hooks/useAutoFetchImages";
import React from "react";

const Dashboard: React.FC = () => {
  useAutoFetchImages();
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2">Short Introduction</h2>
    </div>
  );
};

export default Dashboard;
