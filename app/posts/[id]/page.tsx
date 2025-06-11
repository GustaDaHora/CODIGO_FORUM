// app/posts/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Post } from "@/components/posts/types";
import Cookies from "js-cookie";

export default function PostPage() {
  const params = useParams();
  const postId = params?.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    setIsAuthenticated(!!token);

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

        // After successfully fetching the post, get related posts
        // This could be posts by the same author or in the same category
        fetchRelatedPosts(data.author.id);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load post"
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedPosts = async (authorId: string) => {
      try {
        // Here we're fetching public posts, but in a real app
        // you might want a specific API endpoint for related posts
        const response = await fetch(`/api/posts/public`);
        if (!response.ok) throw new Error("Failed to fetch related posts");

        const data = await response.json();

        // Filter out the current post and limit to 3 related posts
        const filtered = data.filter((p: Post) => p.id !== postId).slice(0, 3);

        setRelatedPosts(filtered);
      } catch (error) {
        console.error("Error fetching related posts:", error);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const handleFollowAuthor = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/posts/" + postId);
      return;
    }

    if (!post) return;

    try {
      const token = Cookies.get("token");
      await fetch("/api/users/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: post.author.id }),
      });

      alert(`You are now following ${post.author.name}`);
    } catch (error) {
      console.error("Error following author:", error);
    }
  };

  if (loading)
    return (
      <>
        <Header />
        <div className="flex flex-col md:flex-row min-h-screen">
          <aside className="p-4 md:w-1/4 bg-[#10141b]"></aside>
          <div className="flex-1 p-4 md:p-6 text-center">Loading post...</div>
          <section className="p-4 md:w-1/4 bg-[#10141b]"></section>
        </div>
        <Footer />
      </>
    );

  if (error)
    return (
      <>
        <Header />
        <div className="flex flex-col md:flex-row min-h-screen">
          <aside className="p-4 md:w-1/4 bg-[#10141b]"></aside>
          <div className="flex-1 p-4 md:p-6 text-red-500 text-center">
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
          <section className="p-4 md:w-1/4 bg-[#10141b]"></section>
        </div>
        <Footer />
      </>
    );

  if (!post)
    return (
      <>
        <Header />
        <div className="flex flex-col md:flex-row min-h-screen">
          <aside className="p-4 md:w-1/4 bg-[#10141b]"></aside>
          <div className="flex-1 p-4 md:p-6 text-center">Post not found</div>
          <section className="p-4 md:w-1/4 bg-[#10141b]"></section>
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left Sidebar - Post Navigation and Info */}
        <aside className="p-4 md:w-1/4 bg-[#10141b]">
          <div className="sticky top-20">
            <Link href="/" className="font-bold bg-inherit text-blue-500 hover:underline mb-6 block">
              ← Back to Feed
            </Link>

            <div className="mt-8">
              <h2 className="text-lg font-bold mb-4">Post Details</h2>
              <div className="text-sm text-gray-400">
                <p className="mb-2">
                  <span className="text-gray-500">Published:</span>
                  <br />
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="mb-2">
                  <span className="text-gray-500">Author:</span>
                  <br />
                  {post.author.name}
                </p>
                <p className="mb-2">
                  <span className="text-gray-500">Reading time:</span>
                  <br />
                  {Math.ceil(post.content.split(" ").length / 200)} min read
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-bold mb-4">Categories</h2>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    Technology
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    Science
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline">
                    Art & Culture
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content - Post */}
        <div className="flex-1 p-4 md:p-6">
          <article className="bg-[#1A202C] p-6 rounded-lg shadow">
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>

            <div className="flex items-center text-gray-400 mb-6">
              <span className="mr-2 text-[#40BE9B]">By {post.author.name}</span>
              <span>•</span>
              <span className="ml-2">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>

            <div className="prose max-w-none text-white">
              {post.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        </div>

        {/* Right Sidebar - Author Info and Related Posts */}
        <section className="p-4 md:w-1/4 bg-[#10141b]">
          <div className="sticky top-20">
            <h2 className="text-lg font-bold mb-4">About the Author</h2>
            <div className="bg-[#1A202C] p-4 rounded-lg mb-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {post.author.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold">{post.author.name}</h3>
                  <p className="text-sm text-gray-400">Member</p>
                </div>
              </div>

              <button
                onClick={handleFollowAuthor}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
              >
                Follow Author
              </button>
            </div>

            <h2 className="text-lg font-bold mb-4">Related Posts</h2>
            {relatedPosts.length > 0 ? (
              <div className="space-y-4">
                {relatedPosts.map((relatedPost) => (
                  <div
                    key={relatedPost.id}
                    className="bg-[#1A202C] p-3 rounded cursor-pointer hover:bg-[#2D3748]"
                    onClick={() => router.push(`/posts/${relatedPost.id}`)}
                  >
                    <h3 className="font-medium text-sm mb-1">
                      {relatedPost.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      By {relatedPost.author.name} •{" "}
                      {formatDistanceToNow(new Date(relatedPost.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No related posts found</p>
            )}

            <div className="mt-8">
              <h2 className="text-lg font-bold mb-4">Trending Topics</h2>
              <div className="space-y-2">
                <span className="inline-block bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2">
                  #technology
                </span>
                <span className="inline-block bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2">
                  #webdev
                </span>
                <span className="inline-block bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2">
                  #ai
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
    );
}
