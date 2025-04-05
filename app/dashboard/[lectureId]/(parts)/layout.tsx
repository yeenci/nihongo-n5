"use client";

import { getLectureName } from "@/app/constants/lectures";
import Crumbs from "@/app/ui/breadcrumbs";
import { useParams, usePathname } from "next/navigation";
import React from "react";

export default function Layout() {
  const { lectureId } = useParams() as { lectureId: string };
  const lectureName = getLectureName(lectureId);
  const pathname = usePathname();
  const partName = pathname.split("/").pop();

  const paths = [
    { label: "Dashboard", href: "/dashboard" },
    { label: lectureName, href: `/dashboard/${lectureId}` },
    { label: partName },
  ];

  return (
  <div className="p-6">
    <Crumbs paths={paths} />
    <h2 className="text-xl font-bold mb-4">{partName}</h2>
    <div>Hiển thị loading ở đây thui!</div>
  </div>
  )
}

