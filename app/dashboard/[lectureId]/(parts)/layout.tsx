"use client";

import { getLecturePart } from "@/app/constants/lectureParts";
import { getLectureName } from "@/app/constants/lectures";
import Crumbs from "@/app/ui/breadcrumbs";
import { useParams, usePathname } from "next/navigation";
import React, { ReactNode } from "react";

export default function LecturePartWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { lectureId } = useParams() as { lectureId: string };
  const partId = pathname.split("/").pop();
  const partName = partId ? getLecturePart(partId) : "Unknown Part";

  const paths = [
    { label: "Dashboard", href: "/dashboard" },
    { label: getLectureName(lectureId), href: `/dashboard/${lectureId}` },
    { label: partName },
  ];

  return (
    <div className="p-6">
      <Crumbs paths={paths} />
      <h2 className="text-xl font-bold mb-4">{partName}</h2>
        {children}
    </div>
  );
}