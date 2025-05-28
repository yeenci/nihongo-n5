// app/resources/page.tsx
"use client";

import PostItem from "@/app/components/posts/post-list";
import { useFetchAllPosts } from "@/hooks/useFetchPosts";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useMemo, useState, ChangeEvent, useEffect } from "react";

type SortOrder = "Newest" | "Oldest";
const POSTS_PER_PAGE = 5;

export default function ResourcesPage() {
  const { posts: allPosts, loading } = useFetchAllPosts();
  const [sortOrder, setSortOrder] = useState<SortOrder>("Newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const processedPosts = useMemo(() => {
    if (!allPosts) return [];

    let filtered = allPosts;
    if (searchTerm.trim() !== "") {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = allPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          (post.description &&
            post.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
          post.email.toLowerCase().includes(lowerCaseSearchTerm) ||
          (post.tags &&
            post.tags.some((tag) =>
              tag.toLowerCase().includes(lowerCaseSearchTerm)
            ))
      );
    }

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });
  }, [allPosts, sortOrder, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOrder]);

  const paginatedPosts = useMemo(() => {
    const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
    const endIdx = startIdx + POSTS_PER_PAGE;
    return processedPosts.slice(startIdx, endIdx);
  }, [processedPosts, currentPage]);

  const totalPages = Math.ceil(processedPosts.length / POSTS_PER_PAGE);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const tabCommonClasses =
    "py-2 px-4 rounded-md text-sm cursor-pointer border transition-colors duration-150";
  const activeTabClasses =
    "bg-primary/90 border-primary/90 text-white font-semibold";
  const inactiveTabClasses =
    "bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400";
  const paginationButtonClasses =
    "px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm hover:bg-gray-100 disabled:opacity-50 cursor-pointer disabled:cursor-default";
  const activePaginationButtonClasses =
    "bg-primary/90 text-white border-primary/90";

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-primary">Shared Hub</h1>
        <Link href="/resources/add" legacyBehavior>
          <a className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md text-sm no-underline transition-colors self-start sm:self-auto">
            Add Post
          </a>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6 gap-4 p-4 border border-gray-200 rounded-lg">
        <div className="w-3/4">
          <input
            type="text"
            id="search-posts"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by title, description, email, tags..."
            className="w-full px-3 py-2 border border-muted rounded-md shadow-sm focus:outline-none focus:ring-primary/80 focus:border-primary/80 sm:text-sm"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex gap-2 order-1 sm:order-2">
            <button
              onClick={() => setSortOrder("Newest")}
              className={`${tabCommonClasses} ${
                sortOrder === "Newest" ? activeTabClasses : inactiveTabClasses
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setSortOrder("Oldest")}
              className={`${tabCommonClasses} ${
                sortOrder === "Oldest" ? activeTabClasses : inactiveTabClasses
              }`}
            >
              Oldest
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="py-10 text-center text-gray-500">
          Loading resources...
        </div>
      )}

      {!loading && paginatedPosts.length > 0 && (
        <div className="space-y-0">
          {paginatedPosts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      )}

      {!loading && paginatedPosts.length === 0 && searchTerm.trim() !== "" && (
        <div className="py-10 text-center text-gray-500">
          No resources found matching &quot;{searchTerm}&quot;. Try a different
          search.
        </div>
      )}

      {!loading && paginatedPosts.length === 0 && searchTerm.trim() === "" && (
        <div className="py-10 text-center text-gray-500">
          No resources available. Be the first to{" "}
          <Link
            href="/resources/add"
            className="text-primary/90 hover:underline"
          >
            add one
          </Link>
          !
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={paginationButtonClasses}
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (pageNumber) =>
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            )
            .map((pageNumber, index, arr) => (
              <span key={pageNumber}>
                {index > 0 && arr[index - 1] + 1 < pageNumber && (
                  <span className="px-2">...</span>
                )}
                <button
                  onClick={() => handlePageChange(pageNumber)}
                  className={`${paginationButtonClasses} ${
                    currentPage === pageNumber
                      ? activePaginationButtonClasses
                      : "bg-white"
                  }`}
                >
                  {pageNumber}
                </button>
              </span>
            ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={paginationButtonClasses}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
