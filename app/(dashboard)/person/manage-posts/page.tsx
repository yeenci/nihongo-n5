import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFetchAllPosts } from "@/hooks/useFetchPosts";
import React, { useMemo } from "react";
import Link from 'next/link';

export default function ManagePostsPage() {
  const { user } = useAuth();
  const { posts, loading, error, refetchPosts } = useFetchAllPosts();

  const userPosts = useMemo(() => {
    if (!user || !posts) return [];
    // Sort by most recent first
    return posts
      .filter(post => post.email === user.email)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [posts, user]);

  if (!user && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="mt-2 text-muted-foreground">Please log in to manage your posts.</p>
        <Link href="/login">
          <Button className="mt-4">Login</Button>
        </Link>
      </div>
    );
  }

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
