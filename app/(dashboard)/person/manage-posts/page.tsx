"use client";

import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFetchAllPosts } from "@/hooks/useFetchPosts";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import AddPostDialog from "@/app/components/posts/add-post";
import Spinner from "@/app/components/spinner";
import { Post } from "@/app/redux/postSlice";
import EditPostDialog from "@/app/components/posts/edit-post";
import { Edit, Loader2, Trash2, Undo2 } from "lucide-react";
import DeletePostDialog from "@/app/components/posts/delete-post";

const ManagePostItem = ({
  post,
  onAction,
}: {
  post: Post;
  onAction: () => void;
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const statusStyles = {
    available: { text: "Live", className: "bg-green-100 text-green-800" },
    edited: { text: "Edited", className: "bg-blue-100 text-blue-800" },
    deleted: { text: "Deleted", className: "bg-red-100 text-red-800" },
  };

  const currentStatusKey = post.status || "available";
  const currentStatus = statusStyles[currentStatusKey];

  const handleRestore = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/posts/restore-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id, userEmail: user?.email }),
      });
      if (!response.ok) throw new Error("Failed to restore post.");
      onAction();
    } catch (error) {
      console.error(error);
      alert("Error: Could not restore post.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg transition-colors hover:bg-gray-50">
      <div className="flex-grow">
        <div className="flex items-center gap-3">
          <Link
            href={`/resources/${post.name}`}
            className="font-semibold text-primary hover:underline"
          >
            {post.title}
          </Link>
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${currentStatus.className}`}
          >
            {currentStatus.text}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Created on: {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {post.status !== "deleted" ? (
          <>
            <EditPostDialog
              postToEdit={post}
              onPostEdited={onAction}
              userEmail={user?.email}
              triggerBtn={
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />
            <DeletePostDialog
              postToDelete={post}
              onPostDeleted={onAction}
              userEmail={user?.email}
              triggerBtn={
                <Button variant="destructive" size="icon" className="h-8 w-8">
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
            />
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRestore}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Undo2 className="h-4 w-4 mr-2" />
            )}
            Restore
          </Button>
        )}
      </div>
    </div>
  );
};

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
          {/* <AddPostDialog
            onPostAdded={refetchPosts}
            userEmail={user?.email}
            btnVariant="default"
            btnIcon={true}
          /> */}
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

        {!loading && !error && userPosts.length > 0 && (
          <div className="space-y-4">
            {userPosts.map((post) => (
              <ManagePostItem
                key={post.id}
                post={post}
                onAction={refetchPosts}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
