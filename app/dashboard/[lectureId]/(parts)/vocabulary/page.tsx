"use client";

import Crumbs from "@/app/ui/breadcrumbs";
import { useParams } from "next/navigation";
import { getLecturePart } from "@/app/constants/lectureParts";
import { getLectureName } from "@/app/constants/lectures";

export default function VocabularyPage() {
  const { lectureId } = useParams() as { lectureId: string };
  const lectureName = getLectureName(lectureId);
  const partId = "vocabulary";
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
      <div>Hiển thị loading ở đây thui!</div>
    </div>
  );
}
