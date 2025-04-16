// app/posts/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Post } from '@/components/posts/types';

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

  if (loading) return (
    <>
      <Header />
      <div className="p-4 text-center">Loading post...</div>
      <Footer />
    </>
  );
  
  if (error) return (
    <>
      <Header />
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
      <Footer />
    </>
  );

  if (!post) return (
    <>
      <Header />
      <div className="p-4 text-center">Post not found</div>
      <Footer />
    </>
  );

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto p-4">
        <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
          ← Back to Feed
        </Link>
        
        <article className="bg-[#1A202C] p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          
          <div className="flex items-center text-gray-400 mb-6">
            <span className="mr-2">By {post.author.name}</span>
            <span>•</span>
            <span className="ml-2">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>
          
          <div className="prose max-w-none text-white">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </div>
      <Footer />
    </>
  );
}