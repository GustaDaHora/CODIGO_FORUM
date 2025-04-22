// components/posts/[id].tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { Post } from './types';

export default function PostPage() {
  const params = useParams();
  const postId = params?.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Post not found");
          }
          throw new Error("Failed to fetch post");
        }
        
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError(error instanceof Error ? error.message : "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (loading) return <div className="p-4 text-center">Loading post...</div>;
  
  if (error) return (
    <div className="p-4 text-red-500 text-center">
      {error}
      <div className="mt-4">
        <button 
          onClick={() => router.push("/")} 
          className="text-blue-500 hover:underline"
        >
          Return to Home
        </button>
      </div>
    </div>
  );

  if (!post) return <div className="p-4 text-center">Post not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Back to Feed
      </Link>
      
      <article className="bg-[#40BE9B] p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        
        <div className="flex items-center text-gray-900 mb-6">
          <span className="mr-2 text-[#40BE9B]">By {post.author.name}</span>
          <span>•</span>
          <span className="ml-2">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
        </div>
        
        <div className="prose max-w-none">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}