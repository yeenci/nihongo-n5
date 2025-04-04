"use client";

import Crumbs from "@/app/ui/breadcrumbs";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getLecturePart } from "@/app/constants/lectureParts";
import { getLectureName } from "@/app/constants/lectures";

export default function LecturePage() {
  const { lectureId } = useParams() as { lectureId: string };
  const lectureName = getLectureName(lectureId);
  const { partId } = useParams() as { partId: string };
  const partName = getLecturePart(partId);

  const paths = [
    { label: "Dashboard", href: "/dashboard" },
    { label: lectureName, href: `/dashboard/${lectureId}` },
    { label: partName },
  ];

  return (
    <div className="p-6">
      <Crumbs paths={paths} />
      <h2 className="text-xl font-bold mb-4">{partName}</h2>
    </div>
  );
}
