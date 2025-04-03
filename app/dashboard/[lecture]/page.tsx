"use client";

import Crumbs from "@/app/ui/breadcrumbs";
import { useParams } from "next/navigation";

export default function LecturePage() {
  const { lecture } = useParams() as { lecture: string };
  const lectureName = decodeURIComponent(lecture);

  const paths = [
    { label: "Dashboard", href: "/dashboard" },
    { label: lectureName },
  ];

  return (
    <div className="p-6">
      <Crumbs paths={paths} />
      <h2 className="text-xl font-bold mb-4">{lectureName}</h2>
    </div>
  );
}
