/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { useFetchAllPosts } from "@/hooks/useFetchPosts";
import { Post, Post as PostType, Comment } from "@/app/redux/postSlice";
import Crumbs from "@/app/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/app/context/AuthContext";
import { Edit, Heart, MessageCircle, Trash2 } from "lucide-react";
import Spinner from "@/app/components/spinner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import DOMPurify from "dompurify";
import EditPostDialog from "@/app/components/posts/edit-post";
import DeletePostDialog from "@/app/components/posts/delete-post";

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
  post,
  onPostEdited,
  onDelete,
}: {
  post: PostType;
  onPostEdited: () => void;
  onDelete: () => void;
}) => {
  const { user } = useAuth();
  return (
    <div className="flex items-center gap-2">
      <EditPostDialog
        postToEdit={post}
        onPostEdited={onPostEdited}
        userEmail={user?.email}
        triggerBtn={
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        }
      />
      <DeletePostDialog
        postToDelete={post}
        onPostDeleted={onPostEdited}
        userEmail={user?.email}
        triggerBtn={
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        }
      />
    </div>
  );
};

const AuthorDisplay = ({
  email,
  date,
  status,
}: {
  email?: string;
  date: string;
  status?: string;
}) => (
  <div className="flex items-center gap-3">
    <SimpleAvatar initials={getInitials(email)} />
    <div className="text-sm">
      <p className="font-semibold text-gray-800">{getNameFromEmail(email)}</p>
      <p className="text-xs text-gray-500">
        {formatDate(date)}{" "}
        {status !== undefined && status === "edited" && "(Edited)"}
      </p>
    </div>
  </div>
);

// Post Content
const PostContent = ({ post }: { post: PostType }) => {
  const sanitizedDescription = DOMPurify.sanitize(post.description);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <div
          className="prose prose-sm sm:prose-base max-w-none text-muted-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        />
      </div>
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
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
    </div>
  );
};

const PostActions = ({
  likesCount,
  commentsCount,
  isLiked,
  onLike,
  onCommentClick,
  isLoggedIn,
}: {
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  onLike: () => void;
  onCommentClick: () => void;
  isLoggedIn: boolean;
}) => (
  <div className="w-full space-y-3">
    <div className="flex gap-2">
      <Button
        variant="ghost"
        className={`w-1/3 flex items-center gap-2 ${
          isLiked ? "text-red-500 font-semibold" : "text-gray-600"
        }`}
        onClick={onLike}
        disabled={!isLoggedIn}
      >
        <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500" : ""}`} />
        {likesCount} {isLiked ? "Liked" : "Like"}
      </Button>
      <Button
        variant="ghost"
        className="w-2/3 flex items-center gap-2 text-gray-600"
        onClick={onCommentClick}
        disabled={!isLoggedIn}
      >
        <MessageCircle className="h-5 w-5" />
        Comment
      </Button>
    </div>
  </div>
);

const CommentForm = ({
  user,
  newComment,
  setNewComment,
  handlePostComment,
  isSubmitting,
}: {
  user: any;
  newComment: string;
  setNewComment: (v: string) => void;
  handlePostComment: (e: FormEvent) => void;
  isSubmitting: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="w-full items-center animate-in fade-in-50 duration-300">
      {user ? (
        <form
          onSubmit={handlePostComment}
          className="flex items-center gap-3 pb-4"
        >
          <SimpleAvatar initials={getInitials(user.email)} />
          <div className="flex-grow flex items-center gap-2">
            <Input
              ref={inputRef}
              placeholder="Add a public comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-grow"
              disabled={isSubmitting}
            />
            <Button type="submit" disabled={!newComment || isSubmitting}>
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center py-4 px-3 bg-gray-50 rounded-md my-4">
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Log in
          </Link>{" "}
          to post a comment.
        </div>
      )}
    </div>
  );
};

const CommentList = ({ comments }: { comments: Comment[] }) => (
  <div className="w-full space-y-6 pt-4 border-t">
    <h3 className="text-lg font-semibold text-gray-800 px-1">Comments</h3>
    {comments.length > 0 ? (
      comments.map((comment) => (
        <div key={comment.id} className="flex items-start gap-3">
          <SimpleAvatar initials={getInitials(comment.userEmail)} />
          <div className="flex-1 bg-gray-50 p-3 rounded-lg">
            <div className="flex items-baseline justify-between">
              <p className="font-semibold text-sm text-gray-900">
                {getNameFromEmail(comment.userEmail)}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(comment.commentedAt)}
              </p>
            </div>
            <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
              {comment.text}
            </p>
          </div>
        </div>
      ))
    ) : (
      <p className="text-sm text-gray-500 text-center py-4">No comments yet.</p>
    )}
  </div>
);

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.postId as string;
  const { user } = useAuth();
  const {
    posts: allPosts,
    loading: allPostsLoading,
    refetchPosts,
  } = useFetchAllPosts();

  const [currentPost, setCurrentPost] = useState<Post | null | undefined>(
    undefined
  );
  const [isLiked, setIsLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState<string[]>([]);
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isCommentFormVisible, setIsCommentFormVisible] = useState(false);

  const paths = [
    { label: "All Resources", href: "/resources" },
    {
      label:
        currentPost && currentPost.status !== "deleted"
          ? currentPost.title
          : "Post Not Found",
    },
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
      <div className="flex flex-col min-h-[calc(100vh-80px)] px-4 py-6">
        <Crumbs paths={paths} />
        <div className="flex flex-grow flex-col items-center justify-center text-center p-4">
          <Spinner />
        </div>
      </div>
    );
  }

  if (currentPost === null || currentPost.status === "deleted")
    return (
      <div className="flex flex-col min-h-[calc(100vh-80px)] px-4 py-6">
        <Crumbs paths={paths} />
        <div className="flex flex-grow flex-col items-center justify-center text-center p-4">
          <h1 className="text-2xl font-bold">Post Not Found</h1>
          <p className="text-gray-600 mt-2">
            The post with the postId &quot;{postId}&quot; could not be found.
          </p>
          <Button asChild className="mt-6">
            <Link href="/resources">Go back</Link>
          </Button>
        </div>
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

  const handlePostComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !currentPost) return;

    const newCommentObject: Comment = {
      id: `temp_${Date.now()}`, // Use a temporary ID for the key
      userEmail: user.email!,
      text: newComment,
      commentedAt: new Date().toISOString(),
    };

    const originalCommentText = newComment;

    setLocalComments((prevComments) => [newCommentObject, ...prevComments]);
    setNewComment("");
    setIsCommentFormVisible(false);

    try {
      const response = await fetch("/api/posts/add-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: currentPost.id,
          userEmail: user.email,
          text: originalCommentText,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to save comment to server.");
      }

      setLocalComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === newCommentObject.id ? result.comment : comment
        )
      );

      // refetchPosts();
    } catch (err: any) {
      console.error("Failed to post comment:", err.message);
      alert(`Error: ${err.message}`);
      setLocalComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== newCommentObject.id)
      );
      setNewComment(originalCommentText);
      setIsCommentFormVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentClick = () => {
    setIsCommentFormVisible((prev) => !prev);
  };

  return (
    <div className="py-6 px-4 h-full">
      <Crumbs paths={paths} />
      <div className="flex flex-col items-center w-full min-h-screen py-4 px-4">
        <div className="w-full max-w-3xl">
          <Card className="shadow-lg mt-4">
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <AuthorDisplay
                  email={currentPost.email}
                  date={currentPost.createdAt}
                  status={currentPost.status}
                />
                {isOwner && (
                  <OwnerActions
                    post={currentPost}
                    onPostEdited={refetchPosts}
                    onDelete={() => alert("Delete clicked!")}
                  />
                )}
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-primary mt-4">
                {currentPost.title}
              </h1>
            </CardHeader>

            <CardContent>
              <PostContent post={currentPost} />
            </CardContent>

            <CardFooter className="flex-col items-start gap-4">
              <PostActions
                likesCount={localLikes.length}
                commentsCount={localComments.length}
                isLiked={isLiked}
                onLike={handleLikeToggle}
                onCommentClick={handleCommentClick} // Pass the new handler
                isLoggedIn={!!user}
              />
              {isCommentFormVisible && (
                <CommentForm
                  user={user}
                  newComment={newComment}
                  setNewComment={setNewComment}
                  handlePostComment={handlePostComment}
                  isSubmitting={isSubmitting}
                />
              )}

              <CommentList comments={localComments} />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
