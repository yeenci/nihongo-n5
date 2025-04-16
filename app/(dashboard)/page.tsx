"use client";

import { useAutoFetchImages } from "@/hooks/useAutoFetchImages";
import React from "react";

const Dashboard: React.FC = () => {
  useAutoFetchImages();

  return (
    <div className="py-6 px-4">
      {" "}
      <h1 className="text-3xl font-bold text-primary">Nihongo N5</h1>
      <p className="text-muted-foreground">
        Let&apos;s start learning! You can view lectures now.
      </p>
    </div>
  );
};

export default Dashboard;
