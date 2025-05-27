// app/resources/page.tsx
"use client";

import { useFetchAllPosts } from "@/hooks/useFetchPosts";
import Link from "next/link";
import styles from "./SharedResourcesPage.module.css"; // We'll create this
import { useMemo } from "react";
import PostItem from "./PostItem";

export default function SharedResourcesPage() {
  const { posts, loading } = useFetchAllPosts();

  const sortedPosts = useMemo(() => {
    if (!posts) return [];
    return [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [posts]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Newest Resources</h1>
        <Link href="/resources/add" legacyBehavior>
          <a className={styles.addPostButton}>Add Post</a>
        </Link>
      </div>

      <div className={styles.subHeader}>
        <span className={styles.postCount}>
          {loading ? "..." : sortedPosts.length} resources
        </span>
        <div className={styles.filterTabs}>
          <button className={`${styles.tabButton} ${styles.active}`}>Newest</button>
          <button className={styles.tabButton}>Active</button>
          <button className={styles.tabButton}>Unanswered</button>
          {/* Add more tabs as needed */}
          <button className={styles.tabButton}>More ▼</button>
        </div>
        <button className={styles.filterButton}>☰ Filter</button>
      </div>

      {loading && <div className={styles.loadingMessage}>Loading resources...</div>}

      {!loading && sortedPosts.length > 0 && (
        <div className={styles.postsList}>
          {sortedPosts.map(post => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      )}

      {!loading && sortedPosts.length === 0 && (
        <div className={styles.noPostsMessage}>
          No resources found. Be the first to add one!
        </div>
      )}
    </div>
  );
}