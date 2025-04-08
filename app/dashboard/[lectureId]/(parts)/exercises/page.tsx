/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useLecturePartData } from "@/hooks/useLecturePartData";

export default function ExercisesPage() {
  const { data, loading } = useLecturePartData();
  return (
    <div className="">
      <div>Content</div>
    </div>
  );
}
