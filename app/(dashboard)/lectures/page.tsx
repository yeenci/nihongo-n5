"use client";

// import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAutoFetchImages } from "@/hooks/useAutoFetchImages";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

type LectureMeta = {
  id: string;
  url: string;
  name: string;
  jp: string;
  en: string;
};

const LecturesPage: React.FC = () => {
  const router = useRouter();
  const { images, loading: imageLoading } = useAutoFetchImages();
  const [meta, setMeta] = useState<LectureMeta[]>([]);
  const [metaLoading, setMetaLoading] = useState(true);
  const placeholderCount = Object.keys(images).length || 12;

  useEffect(() => {
    fetch("/data/lectures.json")
      .then((res) => res.json())
      .then((data: LectureMeta[]) => {
        setMeta(data);
      })
      .finally(() => setMetaLoading(false));
  }, []);

  const allLoading = imageLoading || metaLoading;

  return (
    <div className="py-6 px-4">
      <h1 className="text-3xl font-bold text-primary">All Lectures</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {allLoading &&
          Array.from({ length: placeholderCount }).map((_, index) => (
            <div key={index} className="border rounded p-2 shadow space-y-2">
              <Skeleton className="w-full h-[200px] rounded" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
          ))}

        {!allLoading &&
          meta.map((lecture) => (
            <div key={lecture.id} className="border rounded p-2 cursor-pointer shadow-sm hover:shadow-md group" onClick={() => router.push(`/lectures/${lecture.id}`)}>
              <Image
                src={images[lecture.url]}
                alt={lecture.name}
                width={300}
                height={300}
                className="w-full h-auto object-contain select-none"
                draggable={false}
              />
              <div className="text-center mt-2 space-y-1">
                <p className="text-base font-semibold group-hover:underline">{lecture.name}</p>
                <p className="text-xs text-muted-foreground">{lecture.en}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LecturesPage;
