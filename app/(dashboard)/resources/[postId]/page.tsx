"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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
      <Edit className="h-4 w-4 mr-2" />
    </Button>
    <Button variant="destructive" size="sm" onClick={onDelete}>
      <Trash2 className="h-4 w-4 mr-2" />
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

  // if (currentPost === undefined)
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       Verifying post...
  //     </div>
  //   );

  if (currentPost === null) {
    return (
      <div>
        <h1>Post Not Found</h1>
        <p>The post with the name &quot;{postId}&quot; could not be found.</p>
        <Link href="/resources">Go back to all posts</Link>
      </div>
    );
  }
  if (user?.email === currentPost.email) {
    console.log("This is the person who posted this post.");
  }
  console.log(currentPost.email);

  return (
    <div className="py-6 px-4 h-full">
      <Crumbs paths={paths} />
      <div className="flex flex-row justify-center w-full h-full">
        {/* <div className="w-full max-w-3xl border-1 border-muted p-4"> */}
        <div className="w-full max-w-3xl">
          <div className="flex items-center justify-between mb-1 px-1">
            <h1 className="text-xl mt-4 sm:text-2xl font-bold text-primary">
              {currentPost.title}
            </h1>
          </div>
          <div className="flex items-center mb-1 px-1 text-xs gap-1 text-muted-foreground">
            <strong className="">
              {(() => {
                if (!currentPost.email) {
                  return "Anonymous";
                }
                const parts = currentPost.email.split("@");
                const name = parts[0];

                return name;
              })()}
            </strong>
            •<span className="block">{formatDate(currentPost.createdAt)}</span>
          </div>
          <div className="flex items-center justify-between mb-1 px-1">
            <p className="text-md mt-2 sm:text-base">
              {currentPost.description}
            </p>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-auto text-xs text-gray-500 group-hover:text-gray-600">
            {currentPost.tags && currentPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium
                           group-hover:bg-primary/5 group-hover:text-primary transition-colors duration-150"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          image
          <div className="flex gap-2">
            {currentPost.likes.length} likes - {currentPost.comments.length}{" "}
            comments
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center">
              <Heart className="h-4 w-4" />
              Like
            </Button>
            <Input
              placeholder="Enter your comment..."
              className="outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 border border-gray-300 focus:border-gray-300 focus-visible:border-gray-300"
            />
          </div>
        </div>
      </div>
    </div>
    // <div>
    //   <Link href="/resources">← Back to All Posts</Link>
    //   <h1>{currentPost.name}</h1>
    //   <p><strong>ID:</strong> {currentPost.id}</p>
    //   <p><strong>Email:</strong> {currentPost.email}</p>
    //   <p><strong>Status:</strong> {currentPost.status}</p>
    //   <p><strong>Likes ({currentPost.likes.length}):</strong></p>
    //   {currentPost.likes.length > 0 ? (
    //     <ul>
    //       {currentPost.likes.map((like, index) => (
    //         <li key={`like-${index}`}>{like}</li>
    //       ))}
    //     </ul>
    //   ) : (
    //     <p>No likes yet.</p>
    //   )}
    //   <p><strong>Reports ({currentPost.reports.length}):</strong></p>
    //   {currentPost.reports.length > 0 ? (
    //     <ul>
    //       {currentPost.reports.map((report, index) => (
    //         <li key={`report-${index}`}>{report}</li>
    //       ))}
    //     </ul>
    //   ) : (
    //     <p>No reports.</p>
    //   )}
    // </div>
  );
}

// import Link from "next/link";

// export default async function ResourceSlugPage({
//   params,
// }: {
//   params: { slug: string };
// }) {
//   const awaitedParams = await params; // Await the params object.
//   const { slug } = awaitedParams; // Then destructure from the (identically) resolved object.

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h1 className="text-2xl font-semibold mb-4">
//         Resource Details for: <span className="text-blue-600">{slug}</span>
//       </h1>
//       <p className="mb-2">
//         This is the detailed page for the resource with slug:{" "}
//         <strong>{slug}</strong>.
//       </p>
//       <p>
//         You would typically fetch specific data for this resource using the slug
//         and display it here. For example:
//       </p>
//       <Link
//         href="/resources"
//         className="text-blue-500 hover:underline mt-6 inline-block"
//       >
//         ← Back to all resources
//       </Link>
//     </div>
//   );
// }
