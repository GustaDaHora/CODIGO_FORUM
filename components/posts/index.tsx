// components/posts/index.tsx
"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Post from "./[id]";

interface Post {
  id: number;
  title: string;
  content: string;
  author: { name: string };
  createdAt: string;
}

export default function Feed() {
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
  }, [router]);

  if (loading) return <div className="p-4 text-center">Loading posts...</div>;
  
  if (error) return (
    <div className="p-4 text-red-500 text-center">
      {error}
      {error.includes("Authentication") && (
        <button 
          onClick={() => router.push("/auth/signin")} 
          className="ml-2 text-blue-500 hover:underline"
        >
          Login
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Recent Posts</h1>
      {feed.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="text-gray-600">No posts available. Follow some users or create your first post!</p>
          <button 
            onClick={() => router.push("/posts/create")} 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create a Post
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {feed.map((post) => (
            <div key={post.id} className="py-4">
              <Post {...post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}