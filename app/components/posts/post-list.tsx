/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRouter } from "next/navigation";
import { Post } from "@/app/redux/postSlice";
import DOMPurify from "dompurify";

interface PostItemProps {
  post: Post;
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

// const getStatusColor = (status?: string): string => {
//   if (!status) return "text-gray-600";
//   switch (status.toLowerCase()) {
//     case "available":
//       return "text-green-600";
//     case "reported":
//       return "text-orange-600";
//     case "deleted":
//       return "text-red-600";
//     default:
//       return "text-gray-600";
//   }
// };

export default function PostItem({ post }: PostItemProps) {
  const router = useRouter();
  const sanitizedDescription = DOMPurify.sanitize(post.description);

  return (
    <div
      className="flex py-2 gap-2 group cursor-pointer"
      onClick={() => router.push(`/resources/${post.name}`)}
    >
      <div
        className="flex-grow flex flex-col px-6 py-8 rounded-xl border border-muted 
                     group-hover:border-primary/60 group-hover:shadow-2xl group-hover:scale-[1.01] 
                     transition-all duration-200 ease-in-out bg-white"
      >
        <h3 className="text-lg md:text-xl font-semibold mb-2 text-primary/80 group-hover:text-primary/90">
          {post.title}
        </h3>

        {post.description && (
          <p
            className="text-sm text-muted-foreground/90 mb-3 line-clamp-1 group-hover:text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        )}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-auto mb-3 text-xs text-gray-500 group-hover:text-gray-600">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
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
        <div className="flex gap-2">
          <p className="text-xs text-muted-foreground/80 line-clamp-3 ml-1">
            {post.likes.length} likes
          </p>
          <p className="text-xs text-muted-foreground/80 line-clamp-3 ml-1">
            {post.comments.length} comments
          </p>
        </div>
      </div>
    </div>
  );
}
