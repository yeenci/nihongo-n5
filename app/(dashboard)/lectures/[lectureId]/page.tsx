"use client";

import Crumbs from "@/app/components/breadcrumbs";
import { useParams, useRouter } from "next/navigation";
import { getLectureName, LectureMeta } from "@/app/constants/lectures";
import { Button } from "@/components/ui/button";
import { lectureParts } from "@/app/constants/lectureParts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function LecturePage() {
  const { lectureId } = useParams() as { lectureId: string };
  const name = getLectureName(lectureId);
  const router = useRouter();

  const match = lectureId.match(/^([a-zA-Z]+)(\d+)$/);
  if (!match) throw new Error("Invalid lectureId format");

  const text = match[1];
  const num = parseInt(match[2]);

  const paths = [{ label: "All Lectures", href: "/lectures" }, { label: name }];

  const [meta, setMeta] = useState<LectureMeta[]>([]);
  const currentMeta = meta.find((item) => item.id === lectureId)
  useEffect(() => {
      fetch("/data/lectures.json")
        .then((res) => res.json())
        .then((data: LectureMeta[]) => {
          setMeta(data);
        })
        // .finally(() => setMetaLoading(false));
    }, []);

  return (
    <div className="py-6 px-4 h-full">
      <Crumbs paths={paths} />
      <div className="flex flex-row justify-center w-full h-full">
        <div className="w-full lg:w-4/5 xl:w-3/5 2xl:w-1/2 flex flex-col">
          <div>
            <h1 className="text-3xl font-bold my-4 text-primary">{name} - {currentMeta?.en}</h1>
            <div className="flex flex-row gap-4">
              {Object.entries(lectureParts).map(
                ([partId, { label, icon: Icon }]) => (
                  <div
                    key={partId}
                    className="w-full flex flex-col grid-cols-4 px-6 py-4 border-4 cursor-pointer rounded-md items-center text-base font-medium hover:font-semibold hover:border-muted-foreground"
                    onClick={() => router.push(`${lectureId}/${partId}`)}
                  >
                    <div className="rounded-full border-2 p-4 mb-8">
                      <Icon className="w-10 h-10 text-muted-foreground" />
                    </div>
                    {label}
                  </div>
                )
              )}
            </div>
          </div>
          <div className="flex-grow" />
          <div className="flex justify-between mb-10">
            <Button
              onClick={() => router.push(`${text + (num - 1)}`)}
              disabled={num - 1 == 0}
            >
              <ChevronLeft />
              Previous Lecture
            </Button>
            <Button
              onClick={() => router.push(`${text + (num + 1)}`)}
              disabled={num + 1 == 26}
            >
              Next Lecture <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
