// app/shared-resources/PostItem.tsx (or components/PostItem.tsx)
import { useRouter } from "next/navigation"; // Use next/navigation for App Router
import { Post } from "@/app/redux/postSlice"; // Make sure this path is correct

interface PostItemProps {
  post: Post; // Assuming 'name' is the title or slug, and you have 'tags', 'description', etc.
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
          <p className="text-sm text-muted-foreground/80 mb-3 line-clamp-3 group-hover:text-muted-foreground/90">
            {post.description}
          </p>
        )}

        <div className="flex justify-between mt-auto text-xs text-gray-500 group-hover:text-gray-600">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
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
          {/* <span className="block">Shared by {post.email || "Anonymous"}</span> */}
          <span className="block text-muted-foreground/40">on {formatDate(post.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
