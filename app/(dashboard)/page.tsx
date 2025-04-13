"use client";

import { useAutoFetchImages } from "@/hooks/useAutoFetchImages";
import React from "react";

const Dashboard: React.FC = () => {
  useAutoFetchImages();

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2">Nihongo N5</h2>
      <p className="text-muted-foreground">
        Let&apos;s start learning! You can view lectures now.
      </p>
    </div>
  );
};

export default Dashboard;
