// components/posts/index.tsx
"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Post } from "./types";
import { PostCard } from "./PostCard";

interface FeedProps {
  showCreateButton?: boolean;
  onCreateClick?: () => void;
  publicOnly?: boolean;
}

export default function Feed({ showCreateButton = true, onCreateClick, publicOnly = false }: FeedProps) {
  const [feed, setFeed] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = Cookies.get("token");
        
        if (!token) {
          // Show some public posts instead of requiring login
          const res = await fetch(`/api/posts/public`);
          if (!res.ok) throw new Error("Failed to fetch public posts");
          const data = await res.json();
          setFeed(data);
          return;
        }

        // Fetch feed for authenticated user
        const res = await fetch(`/api/feed`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!res.ok) {
          if (res.status === 401) {
            // Token invalid or expired
            Cookies.remove("token");
            throw new Error("Authentication expired. Please login again.");
          }
          throw new Error("Failed to fetch posts");
        }
        
        const data = await res.json();
        setFeed(data);
      } catch (error) {
        console.error("Error fetching feed:", error);
        setError(error instanceof Error ? error.message : "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [publicOnly]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-40 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 text-red-500 p-4 rounded">
          Error: {error}
          {error.includes("Authentication") && (
            <button 
              onClick={() => router.push("/auth/login")} 
              className="ml-2 text-blue-500 hover:underline"
            >
              Login
            </button>
          )}
        </div>
      </div>
    );
  }

  const handlePostClick = (postId: string) => {
    router.push(`/posts/${postId}`);
  };

  return (
    <div className="p-4">
      {showCreateButton && (
        <div className="mb-6">
          <button
            onClick={onCreateClick || (() => router.push("/posts/create"))}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create a Post
          </button>
        </div>
      )}
      {feed.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No posts found. Be the first to create one!
        </div>
      ) : (
        <div className="space-y-4">
          {feed.map((post) => (
            <div key={post.id}>
              <PostCard post={post} onPostClick={handlePostClick} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}