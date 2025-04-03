"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from 'next/navigation';

const Dashboard: React.FC = () => {
  const lectures = Array.from({ length: 25 }, (_, i) => `Lecture ${i + 1}`);
  const router = useRouter() ;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to Nihongo N5</h1>
      <h2 className="text-xl font-semibold mb-2">All Lectures</h2>
      <div>{lectures.map((lecture) => (
        <Button variant={"outline"} key={lecture} onClick={() => router.push(`/dashboard/${lecture}`)}>{lecture}</Button>
      ))}</div>
      {/* <h1>There is just data of lecture 1</h1> */}
    </div>
  );
};

export default Dashboard;
