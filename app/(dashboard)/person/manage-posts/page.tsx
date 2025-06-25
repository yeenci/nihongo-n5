"use client";

import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFetchAllPosts } from "@/hooks/useFetchPosts";
import React, { useMemo } from "react";
import Link from "next/link";
import AddPostDialog from "@/app/components/posts/add-post";
import Spinner from "@/app/components/spinner";
import { Post } from "@/app/redux/postSlice";


const ManagePostItem = ({ post, onAction }: { post: Post, onAction: () => void }) => {
  const post = ""
}

export default function ManagePostsPage() {
  const { user } = useAuth();
  const { posts, loading, error, refetchPosts } = useFetchAllPosts();

  const userPosts = useMemo(() => {
    if (!user || !posts) return [];
    // Sort by most recent first
    return posts
      .filter((post) => post.email === user.email)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [posts, user]);

  if (!user && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="mt-2 text-muted-foreground">
          Please log in to manage your posts.
        </p>
        <Link href="/login">
          <Button className="mt-4">Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-row h-full justify-center w-full p-4">
      <div className="w-full lg:w-4/5 xl:w-3/5 2xl:w-1/2">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-primary">Your Posts</h1>
            <AddPostDialog
                onPostAdded={refetchPosts}
                userEmail={user?.email}
                btnVariant="default"
                btnIcon={true}
            />
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        )}

        {!loading && error && (
          <div className="p-4 text-center text-red-600 bg-red-50 rounded-lg">
            <p>Error loading posts: {error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
