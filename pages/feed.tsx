"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

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

  useEffect(() => {
    const fetchFeed = async () => {
      const token = Cookies.get("token");
      if (!token) return;

      const res = await fetch(`/api/feed?userId=1`);
      const data = await res.json();
      setFeed(data);
      setLoading(false);
    };

    fetchFeed();
  }, []);

  if (loading) return <p>Loading feed...</p>;

  return (
    <div>
      <h1>Your Feed</h1>
      {feed.length === 0 ? (
        <p>No posts from followed users.</p>
      ) : (
        feed.map((post) => (
          <div key={post.id} className="post">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <small>By {post.author.name}</small>
          </div>
        ))
      )}
    </div>
  );
}

