"use client";

import { getLecturePart } from "@/app/constants/lectureParts";
import { getLectureName } from "@/app/constants/lectures";
import {
  LectureLoadingProvider,
  useLectureLoading,
} from "@/app/context/LectureLoadingContext";
import Crumbs from "@/app/ui/breadcrumbs";
import { useParams, usePathname } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

function LayoutContent({ children }: { children: ReactNode }) {
  const { isLoading } = useLectureLoading();
  const pathname = usePathname();
  const { lectureId } = useParams() as { lectureId: string };
  const partId = pathname.split("/").pop();
  const partName = partId ? getLecturePart(partId) : "Unknown Part";

  const paths = [
    { label: "Dashboard", href: "/dashboard" },
    { label: getLectureName(lectureId), href: `/dashboard/${lectureId}` },
    { label: partName },
  ];

  useEffect(() => {});

  return (
    <div className="p-6">
      <Crumbs paths={paths} />
      <h2 className="text-xl font-bold mb-4">{partName}</h2>
      {isLoading ? (
        <p className="text-gray-500">⏳ Loading content...</p>
      ) : (
        children
      )}
    </div>
  );
}

export default function LecturePartWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <LectureLoadingProvider>
      <LayoutContent>{children}</LayoutContent>
    </LectureLoadingProvider>
  );
}
