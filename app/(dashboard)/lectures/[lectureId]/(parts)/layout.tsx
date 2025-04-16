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
    { label: "All Lectures", href: "/lectures" },
    { label: getLectureName(lectureId), href: `/lectures/${lectureId}` },
    { label: partName },
  ];

  return (
    <div className="py-6 px-4">
      <Crumbs paths={paths} />
      {/* <h1 className="text-2xl font-bold text-primary mt-4">{partName}</h1> */}
        {children}
    </div>
  );
}