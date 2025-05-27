// app/shared-resources/PostItem.tsx (or components/PostItem.tsx)
import Link from "next/link";
import { Post } from "@/app/redux/postSlice"; // Your Post interface
import styles from "./PostItem.module.css"; // We'll create this CSS module

interface PostItemProps {
  post: Post;
}

// Helper function to format date (simple version)
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export default function PostItem({ post }: PostItemProps) {
  return (
    <div className={styles.postItem}>
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span>{post.likes.length}</span>
          <span>likes</span>
        </div>
        <div className={`${styles.statItem} ${styles[post.status.toLowerCase()]}`}>
          <span>{post.status}</span>
        </div>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>
          <Link href={`/resources/${post.name}`}>{post.name}</Link>
        </h3>
        {/* You could add a short description here if your Post model had one */}
        {/* <p className={styles.summary}>Short summary of the post...</p> */}
        <div className={styles.meta}>
          {/* <div className={styles.tags}>
            {post.tags && post.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
          </div> */}
          <div className={styles.authorInfo}>
            <span>Shared by {post.email}</span>
            <span className={styles.timestamp}>on {formatDate(post.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}