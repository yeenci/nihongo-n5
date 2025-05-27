import { useAppDispatch, useAppSelector } from "@/app/redux/store";
import { useState } from "react";

export function useFetchAllPosts() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.post.data);

    const [loading, setLoading] = useState(false);
}