/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useLecturePartData } from "@/hooks/useLecturePartData";

export default function ExercisesPage() {
  const { data, loading } = useLecturePartData();
  return (
    <div className="">
          <h1 className="text-3xl font-bold my-4 text-primary">Exercises</h1>
      <div>Content</div>
    </div>
  );
}
