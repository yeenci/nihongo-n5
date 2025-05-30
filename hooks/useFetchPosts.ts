/* eslint-disable @typescript-eslint/no-explicit-any */
import { saveMultiplePosts, Post } from "@/app/redux/postSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/store";
import { useCallback, useEffect, useState } from "react";

export function useFetchAllPosts() {
  const dispatch = useAppDispatch();
  const postsFromRedux = useAppSelector((state) => state.post.data);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/posts/get-all-posts");
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `HTTP error! status: ${res.status}, message: ${errorText}`
        );
      }
      const fetchedPostsData: Post[] = await res.json();
      dispatch(saveMultiplePosts(fetchedPostsData));
    } catch (error: any) {
      setError(
        error.message || "An unknown error occurred while fetching posts"
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Call fetchPosts initially if posts are not loaded
  useEffect(() => {
    if (postsFromRedux.length === 0) {
      fetchPosts();
    }
  }, [postsFromRedux.length, fetchPosts]);

  const refetchPosts = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts: postsFromRedux, loading, error, refetchPosts };
}
