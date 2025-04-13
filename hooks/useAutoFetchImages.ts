"use client";

import { saveMultipleImages } from "@/app/redux/imageSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/store";
import { useEffect, useState } from "react";

export function useAutoFetchImages() {
  const dispatch = useAppDispatch();
  const images = useAppSelector((state) => state.image.data);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Object.keys(images).length === 0) {
      setLoading(true);
      fetch("/api/fetch/images")
        .then((res) => res.json())
        .then((imageMap) => dispatch(saveMultipleImages(imageMap)))
        .finally(() => setLoading(false));
    }
  }, [dispatch, images]);

  return { images, loading };
}
