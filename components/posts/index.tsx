// components/posts/index.tsx
"use client";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    // Check if user is authenticated
    const token = Cookies.get("token");
    setIsAuthenticated(!!token);
    
    // If publicOnly is true, force public mode
    if (publicOnly) {
      setViewMode('public');
    }
    
    fetchPosts();
  }, [publicOnly, viewMode]);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    
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
  };

  const fetchPublicPosts = async () => {
    const res = await fetch(`/api/posts/public`);
    
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
    
    const res = await fetch(`/api/posts/feed`, {
      headers: {
        Authorization: `Bearer ${token}`,
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

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-40 bg-gray-400 rounded"></div>
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
        />
      )}
    </div>
  );
}