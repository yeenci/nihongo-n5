"use client";

import { getLecturePart } from "@/app/constants/lectureParts";
import { getLectureName } from "@/app/constants/lectures";
import Crumbs from "@/app/ui/breadcrumbs";
import { useParams, usePathname } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";

export default function PartLayout({ children }: { children: ReactNode }) {
  const { lectureId } = useParams() as { lectureId: string };
  const lectureName = getLectureName(lectureId);
  const pathname = usePathname();
  const partId = pathname.split("/").pop();
  const partName = partId ? getLecturePart(partId) : "Unknown Part";

  const [isLoading, setLoading] = useState(true);

  const paths = [
    { label: "Dashboard", href: "/dashboard" },
    { label: lectureName, href: `/dashboard/${lectureId}` },
    { label: partName },
  ];

  useEffect(() => {}, );

  return (
    <div className="p-6">
      <Crumbs paths={paths} />
      <h2 className="text-xl font-bold mb-4">{partName}</h2>
      {isLoading && <>{children}</>}
    </div>
  );
}
