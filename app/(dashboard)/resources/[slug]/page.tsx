"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useFetchAllPosts } from "@/hooks/useFetchPosts";
import { Post } from "@/app/redux/postSlice";
import { User } from "lucide-react";
import Crumbs from "@/app/components/breadcrumbs";

export default function PostDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { posts: allPosts, loading: allPostsLoading } = useFetchAllPosts();

  const [currentPost, setCurrentPost] = useState<Post | null | undefined>(
    undefined
  );
  // const paths = [{ label: "All Resources", href: "/resources" }, { label: currentPost.title | null }];
  const paths = [
    { label: "All Resources", href: "/resources" },
    { label: currentPost ? currentPost.title : "Post Not Found" },
  ];

  useEffect(() => {
    if (!allPostsLoading) {
      if (allPosts.length > 0 && slug) {
        const foundPost = allPosts.find((p) => p.name === slug);
        setCurrentPost(foundPost || null);
      } else if (slug) {
        setCurrentPost(null);
      }
    }
  }, [slug, allPosts, allPostsLoading]);

  if (allPostsLoading) {
    return <div>Loading post data...</div>;
  }

  if (currentPost === undefined) {
    return <div>Verifying post...</div>;
  }

  if (currentPost === null) {
    return (
      <div>
        <h1>Post Not Found</h1>
        <p>The post with the name &quot;{slug}&quot; could not be found.</p>
        <Link href="/resources">Go back to all posts</Link>
      </div>
    );
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
          {currentPost.description}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-auto text-xs text-gray-500 group-hover:text-gray-600">
          {currentPost.tags && currentPost.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {currentPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium
                           group-hover:bg-primary/5 group-hover:text-primary transition-colors duration-150"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
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
