import { useAuth } from "@/app/context/AuthContext";
import { Card } from "@/components/ui/card";
import { useFetchAllPosts } from "@/hooks/useFetchPosts";
import React from "react";

export default function ManagePostsPage() {
  const { user } = useAuth();
  const { posts, loading, error, refetchPosts } = useFetchAllPosts();

  return (
    <div className="flex flex-row h-full justify-center w-full">
      <div className="w-full lg:w-4/5 xl:w-3/5 2xl:w-1/2">
        <h1 className="text-3xl font-bold my-4 text-primary">Your Posts</h1>
        All your posts are here!
        <Card />
      </div>
    </div>
  );
}
