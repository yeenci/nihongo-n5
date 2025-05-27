import { saveMultiplePosts, Post } from "@/app/redux/postSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/store";
import { useEffect, useState } from "react";

export function useFetchAllPosts() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.post.data);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (posts.length === 0) {
      setLoading(true);
      fetch("/api/posts/get-all-posts")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((fetchedPosts: Post[]) => {
          dispatch(saveMultiplePosts(fetchedPosts));
        })
        .catch(error => {
          console.error("Failed to fetch posts:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [dispatch, posts]);

  return { posts, loading };
}
