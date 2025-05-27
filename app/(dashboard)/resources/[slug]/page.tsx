"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useFetchAllPosts } from "@/hooks/useFetchPosts"; // To ensure posts are loaded
import { Post } from "@/app/redux/postSlice"; // Import the Post interface

export default function PostDetailPage() {
  const params = useParams();
  const slug = params.slug as string; // e.g., "post-1716840000000"

  const { posts: allPosts, loading: allPostsLoading } = useFetchAllPosts();

  const [currentPost, setCurrentPost] = useState<Post | null | undefined>(undefined);

  useEffect(() => {
    if (!allPostsLoading) { // Only process once the main posts loading is complete
      if (allPosts.length > 0 && slug) {
        const foundPost = allPosts.find(p => p.name === slug);
        setCurrentPost(foundPost || null); // Set to foundPost or null if not found
      } else if (slug) {
        setCurrentPost(null); // Post not found
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

  return (
    <div>
      <Link href="/resources">← Back to All Posts</Link>
      <h1>{currentPost.name}</h1>
      <p><strong>ID:</strong> {currentPost.id}</p>
      <p><strong>Email:</strong> {currentPost.email}</p>
      <p><strong>Status:</strong> {currentPost.status}</p>
      <p><strong>Likes ({currentPost.likes.length}):</strong></p>
      {currentPost.likes.length > 0 ? (
        <ul>
          {currentPost.likes.map((like, index) => (
            <li key={`like-${index}`}>{like}</li>
          ))}
        </ul>
      ) : (
        <p>No likes yet.</p>
      )}
      <p><strong>Reports ({currentPost.reports.length}):</strong></p>
      {currentPost.reports.length > 0 ? (
        <ul>
          {currentPost.reports.map((report, index) => (
            <li key={`report-${index}`}>{report}</li>
          ))}
        </ul>
      ) : (
        <p>No reports.</p>
      )}
    </div>
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
