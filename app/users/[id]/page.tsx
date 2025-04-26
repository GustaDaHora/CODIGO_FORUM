"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";

interface User {
  id: string;
  name: string;
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
}

export default function UserProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch user profile
        const res = await fetch(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await res.json();
        setUser(userData);

        // Fetch user's posts
        const postsRes = await fetch(`/api/posts?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setUserPosts(postsData.data || []);
        }

        // Check if current user is following this user
        const followingRes = await fetch(`/api/users/following`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (followingRes.ok) {
          const followingData = await followingRes.json();
          setIsFollowing(followingData.some((u: User) => u.id === userId));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, router]);

  const handleFollowToggle = async () => {
    const token = Cookies.get("token");
    if (!token || !user) return;

    try {
      const method = isFollowing ? 'DELETE' : 'POST';
      const url = isFollowing 
        ? `/api/users/follow?userId=${userId}`
        : '/api/users/follow';

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        ...(method === 'POST' && { body: JSON.stringify({ userId }) }),
      });

      if (res.ok) {
        setIsFollowing(!isFollowing);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!user) {
    return <div className="text-center py-8">User not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-[#17191a] rounded-lg p-6 mb-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-[#279B7B]">{user.name}&apos;s Profile</h1>
          <button
            onClick={handleFollowToggle}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isFollowing
                ? 'bg-gray-600 hover:bg-gray-700'
                : 'bg-[#279B7B] hover:bg-[#1e8b6a]'
            }`}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <span className="block text-2xl font-bold text-white">{userPosts.length}</span>
            <span className="text-gray-400">Posts</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-white">{user._count?.followers || 0}</span>
            <span className="text-gray-400">Followers</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-white">{user._count?.following || 0}</span>
            <span className="text-gray-400">Following</span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-[#279B7B] mb-4">Posts</h2>
        {userPosts.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No posts yet</p>
        ) : (
          <div className="space-y-4">
            {userPosts.map((post) => (
              <article 
                key={post.id}
                className="bg-[#17191a] p-4 rounded-lg cursor-pointer hover:bg-[#1f2123] transition-colors"
                onClick={() => router.push(`/posts/${post.id}`)}
              >
                <h3 className="text-xl text-[#279B7B] font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-300 line-clamp-2">{post.content}</p>
                <div className="text-sm text-gray-400 mt-2">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}