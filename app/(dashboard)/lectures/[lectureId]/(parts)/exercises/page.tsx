/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useLecturePartData } from "@/hooks/useLecturePartData";

export default function ExercisesPage() {
  const { data, loading } = useLecturePartData();
  return (
    <div className="flex flex-row h-full justify-center w-full">
      <div className="w-full lg:w-4/5 xl:w-3/5 2xl:w-1/2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold my-4 text-primary">Vocabulary</h1>
        </div>
      </div>
    </div>
  );
}
