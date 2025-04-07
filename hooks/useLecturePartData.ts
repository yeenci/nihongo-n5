/* eslint-disable @typescript-eslint/no-explicit-any */
import { LecturePart, saveLecturePart } from "@/app/redux/lectureSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/store";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function useLecturePartData() {
  const pathname = usePathname();
  const { lectureId } = useParams() as { lectureId: string };
  const partId = pathname.split("/").pop();

  const dispatch = useAppDispatch();
  const data = useAppSelector(
    (state) => state.lecture.data[lectureId]?.[partId as LecturePart]
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) {
      setLoading(true);
      fetch(`/api/fetch/vocabulary?partId=${partId}&lectureId=${lectureId}`)
        .then((res) => res.json())
        .then((json) =>
          dispatch(
            saveLecturePart({
              partId: partId as any,
              lectureId: lectureId,
              data: json,
            })
          )
        )
        .finally(() => setLoading(false));
    }
  }, [data, dispatch, partId, lectureId]);

  return { data, loading };
}
