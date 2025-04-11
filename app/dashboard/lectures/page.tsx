"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/navigation";
import { lectures } from "@/app/constants/lectures";

const Dashboard: React.FC = () => {
  const router = useRouter();

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2">All Lectures</h2>
      <div className="flex flex-wrap gap-2">{Object.entries(lectures).map(([lectureId, lectureName]) => (
        <Button key={lectureId} className="" variant={"outline"} onClick={() => router.push(`/dashboard/lectures/${lectureId}`)}>{lectureName}</Button>
      ))}</div>
    </div>
  );
};

export default Dashboard;
