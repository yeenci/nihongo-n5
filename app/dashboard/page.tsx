"use client";

// import { Button } from "@/components/ui/button";
import React from "react";
// import { useRouter } from "next/navigation";
// import { lectures } from "../constants/lectures";

const Dashboard: React.FC = () => {
  // const router = useRouter();

  return (
    <div className="p-6">
      {/* <h1 className="text-2xl font-bold mb-4">Welcome to Nihongo N5</h1> */}
      <h2 className="text-xl font-semibold mb-2">Short Introduction</h2>
      {/* <div className="flex flex-wrap gap-2">{Object.entries(lectures).map(([lectureId, lectureName]) => (
        <Button key={lectureId} className="" variant={"outline"} onClick={() => router.push(`dashboard/${lectureId}`)}>{lectureName}</Button>
      ))}</div> */}
      {/* <h1>There is just data of lecture 1</h1> */}
    </div>
  );
};

export default Dashboard;
