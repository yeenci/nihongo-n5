"use client";

import { getLecturePart } from "@/app/constants/lectureParts";
import { getLectureName } from "@/app/constants/lectures";
import Crumbs from "@/app/components/breadcrumbs";
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
      <h1 className="text-3xl font-bold my-4">{partName}</h1>
        {children}
    </div>
  );
}