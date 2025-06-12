// components/posts/index.tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Post } from "./types";
import { PostCard } from "./PostCard";
import CreatePostModal from "./create";

interface FeedProps {
  showCreateButton?: boolean;
  onCreateClick?: () => void;
  publicOnly?: boolean;
}

export default function Feed({
  showCreateButton = true,
  onCreateClick,
  publicOnly = false,
}: FeedProps) {
  const [feed, setFeed] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [viewMode, setViewMode] = useState<'public' | 'personal'>('public');
  const router = useRouter();

  const fetchPublicPosts = async () => {
    const timestamp = Date.now(); // Add cache-busting timestamp
    const res = await fetch(`/api/posts/public?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch public posts");
    }
    
    const data = await res.json();
    setFeed(data);
  };

  const fetchPersonalFeed = async () => {
    const token = Cookies.get("token");
    
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const timestamp = Date.now(); // Add cache-busting timestamp
    const res = await fetch(`/api/posts/feed?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        // Token invalid or expired
        Cookies.remove("token");
        throw new Error("Authentication expired. Please login again.");
      }
      throw new Error("Failed to fetch personalized feed");
    }

    const data = await res.json();
    
    // Check the structure of data and extract the posts array
    if (data.data && Array.isArray(data.data)) {
      setFeed(data.data);
    } else {
      console.error("Unexpected API response format:", data);
      throw new Error("Received invalid data format from server");
    }
  };

  // Toggle between personal and public feed
  const toggleFeedType = () => {
    setViewMode(viewMode === 'public' ? 'personal' : 'public');
  };

  // Function to handle the create post button click
  const handleCreateClick = () => {
    // If an external click handler is provided, use that instead
    if (onCreateClick) {
      onCreateClick();
    } else {
      // Otherwise, open our own modal
      setIsCreatePostOpen(true);
    }
  };

  // Function to close the create post modal
  const closeCreatePost = () => {
    setIsCreatePostOpen(false);
  };

  // Function to refresh posts (exposed for modal)
  const refreshFeed = useCallback(async () => {
    setLoading(true);
    try {
      if (viewMode === 'personal' && isAuthenticated) {
        await fetchPersonalFeed();
      } else {
        await fetchPublicPosts();
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(error instanceof Error ? error.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [viewMode, isAuthenticated, publicOnly]);

  useEffect(() => {
    refreshFeed(); // initial load

    const interval = setInterval(() => {
      refreshFeed(); // updated state is captured properly here
    }, 10000);

    return () => clearInterval(interval);
  }, [refreshFeed]);

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {viewMode === 'personal' ? 'Your Feed' : 'Community Posts'}
        </h1>
        
        <div className="flex gap-2">
          {isAuthenticated && !publicOnly && (
            <button
              onClick={toggleFeedType}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              {viewMode === 'personal' ? 'View All Posts' : 'View Your Feed'}
            </button>
          )}
          
          {showCreateButton && isAuthenticated && (
            <button 
              onClick={handleCreateClick} 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create a Post
            </button>
          )}
          
          {!isAuthenticated && showCreateButton && (
            <button 
              onClick={() => router.push('/auth/login')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Log In to Create Post
            </button>
          )}
        </div>
      </div>
      
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

      {/* Only render our own modal if we're not using an external one */}
      {!onCreateClick && (
        <CreatePostModal 
          isOpen={isCreatePostOpen} 
          onClose={closeCreatePost} 
          onPostCreated={refreshFeed}
        />
      )}
    </div>
  );
}