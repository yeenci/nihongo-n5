"use client";

import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { useFetchAllPosts } from "@/hooks/useFetchPosts";
import { Post, Post as PostType } from "@/app/redux/postSlice";
import Crumbs from "@/app/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/app/context/AuthContext";
import { Edit, Heart, Trash2 } from "lucide-react";
import Spinner from "@/app/components/spinner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Comment {
  id: string;
  userEmail: string;
  text: string;
  createdAt: string;
}

function formatDate(dateString: string) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getNameFromEmail(email?: string): string {
  if (!email) return "Anonymous";
  return email.split("@")[0];
}

function getInitials(email?: string): string {
  if (!email) return "AN";
  const name = getNameFromEmail(email);
  const parts = name.split(/[._-]/);
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const SimpleAvatar = ({ initials }: { initials: string }) => (
  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/5 text-sm font-semibold text-primary/80">
    {initials}
  </div>
);

const OwnerActions = ({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <div className="flex items-center gap-2">
    <Button variant="outline" size="sm" onClick={onEdit}>
      <Edit className="h-4 w-4" />
    </Button>
    <Button variant="destructive" size="sm" onClick={onDelete}>
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);

const AuthorDisplay = ({ email, date }: { email?: string; date: string }) => (
  <div className="flex items-center gap-3">
    <SimpleAvatar initials={getInitials(email)} />
    <div className="text-sm">
      <p className="font-semibold text-gray-800">{getNameFromEmail(email)}</p>
      <p className="text-xs text-gray-500">{formatDate(date)}</p>
    </div>
  </div>
);

// Post Content
const PostContent = ({ post }: { post: PostType }) => (
  <div className="space-y-4">
    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
      {post.description}
    </p>
    <div className="relative w-full overflow-hidden rounded-lg aspect-video bg-gray-100">
      {post.resourceFileNames}
      <Image
        src={`https://picsum.photos/seed/${post.id}/1200/630`}
        alt={post.title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
      />
    </div>
    {post.tags && post.tags.length > 0 && (
      <div className="flex flex-wrap gap-2 pt-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="bg-primary/10 text-primary/90 px-2.5 py-1 rounded-full text-xs font-medium"
          >
            #{tag}
          </span>
        ))}
      </div>
    )}
  </div>
);

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.postId as string;
  const { user } = useAuth();
  const { posts: allPosts, loading: allPostsLoading } = useFetchAllPosts();

  const [currentPost, setCurrentPost] = useState<Post | null | undefined>(
    undefined
  );
  const [isLiked, setIsLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState<string[]>([]);
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paths = [
    { label: "All Resources", href: "/resources" },
    { label: currentPost ? currentPost.title : "Post Not Found" },
  ];

  useEffect(() => {
    if (!allPostsLoading && allPosts.length > 0 && postId) {
      const foundPost = allPosts.find((p) => p.name === postId);
      setCurrentPost(foundPost || null);
      if (foundPost) {
        const userEmail = user?.email || "";
        setLocalLikes(foundPost.likes || []);
        setIsLiked(foundPost.likes?.includes(userEmail) || false);
        setLocalComments((foundPost.comments as unknown as Comment[]) || []);
      }
    } else if (!allPostsLoading) {
      setCurrentPost(null);
    }
  }, [postId, allPosts, allPostsLoading, user]);

  if (allPostsLoading || currentPost === undefined) {
    return (
      <div className="flex flex-col items-center w-full min-h-screen py-8 px-4">
        <div className="w-full max-w-3xl">
          <div className="flex justify-center items-center h-60">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  if (currentPost === null)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <h1 className="text-2xl font-bold">Post Not Found</h1>
        <p className="text-gray-600 mt-2">
          The post with the name &quot;{postId}&quot; could not be found.
        </p>
        <Button asChild className="mt-6">
          <Link href="/resources">Go back to all posts</Link>
        </Button>
      </div>
    );

  const isOwner = user?.email === currentPost.email;

  const handleLikeToggle = () => {
    if (!user) return;
    const userEmail = user.email!;
    setIsLiked((prev) => !prev);
    setLocalLikes((prevLikes) =>
      isLiked
        ? prevLikes.filter((email) => email !== userEmail)
        : [...prevLikes, userEmail]
    );
  };

  const handlePostComment = (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    setIsSubmitting(true);
    setTimeout(() => {
      // Simulate API call
      const newCommentObject: Comment = {
        id: `comment_${Date.now()}`,
        userEmail: user.email!,
        text: newComment,
        createdAt: new Date().toISOString(),
      };
      setLocalComments((prev) => [newCommentObject, ...prev]);
      setNewComment("");
      setIsSubmitting(false);
      // TODO: Add API call to post comment to the database
    }, 500);
  };

  return (
    <div className="py-6 px-4 h-full">
      <Crumbs paths={paths} />
      <Card className="shadow-lg mt-4">
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <AuthorDisplay
              email={currentPost.email}
              date={currentPost.createdAt}
            />
            {isOwner && (
              <OwnerActions
                onEdit={() => alert("Edit clicked!")}
                onDelete={() => alert("Delete clicked!")}
              />
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mt-4">
            {currentPost.title}
          </h1>
        </CardHeader>
          <CardContent>
            <PostContent post={currentPost} />
          </CardContent>
      </Card>
    </div>
  );
}