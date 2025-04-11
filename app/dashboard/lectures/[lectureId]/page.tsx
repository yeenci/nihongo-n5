"use client";

import Crumbs from "@/app/components/breadcrumbs";
import { useParams, useRouter } from "next/navigation";
import { getLectureName } from "@/app/constants/lectures";
import { Button } from "@/components/ui/button";
import { lectureParts } from "@/app/constants/lectureParts";

export default function LecturePage() {
  const { lectureId } = useParams() as { lectureId: string };
  const name = getLectureName(lectureId);
  const router = useRouter();

  const paths = [
    { label: "All Lectures", href: "/dashboard/lectures" },
    { label: name },
  ];

  return (
    <div className="p-6">
      <Crumbs paths={paths} />
      <h2 className="text-xl font-bold mb-4">{name}</h2>
      <div className="flex flex-wrap gap-2">{Object.entries(lectureParts).map(([partId, partName]) => (
        <Button key={partId} className="" variant={"outline"} onClick={() => router.push(`${lectureId}/${partId}`)}>{partName}</Button>
      ))}</div>
    </div>
  );
}
