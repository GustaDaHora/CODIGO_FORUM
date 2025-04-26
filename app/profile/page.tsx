"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  name: string;
  _count?: {
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

interface FollowedUser {
  id: string;
  name: string;
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>([]);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await res.json();
        setUser(data);
        setNewName(data.name);

        // Fetch user's posts
        const postsRes = await fetch(`/api/posts?userId=${data.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setUserPosts(postsData.data || []);
        }

        // Fetch followed users
        const followingRes = await fetch("/api/users/following", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (followingRes.ok) {
          const followingData = await followingRes.json();
          setFollowedUsers(followingData);
        }
      } catch (error) {
        console.error(error);
        Cookies.remove("token");
        router.replace("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleNameSubmit = async () => {
    setNameError(null);
    setSuccessMessage(null);

    if (!newName || newName.trim() === "") {
      setNameError("Name cannot be empty");
      return;
    }

    const token = Cookies.get("token");
    if (!token) return;

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update name");
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      setEditingName(false);
      setSuccessMessage("Name updated successfully");
    } catch (error) {
      setNameError(
        error instanceof Error ? error.message : "Failed to update name"
      );
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setSuccessMessage(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 5) {
      setPasswordError("New password must be at least 5 characters long");
      return;
    }

    const token = Cookies.get("token");
    if (!token) return;

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update password");
      }

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
      setSuccessMessage("Password updated successfully");
    } catch (error) {
      setPasswordError(
        error instanceof Error ? error.message : "Failed to update password"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <div className="text-center py-8">Failed to load user data.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content - Profile and Posts */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#17191a] rounded-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-[#279B7B] mb-4">
              {user.name}&apos;s Profile
            </h1>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <span className="block text-2xl font-bold text-white">
                  {userPosts.length}
                </span>
                <span className="text-gray-400">Posts</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold text-white">
                  {user._count?.followers || 0}
                </span>
                <span className="text-gray-400">Followers</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold text-white">
                  {user._count?.following || 0}
                </span>
                <span className="text-gray-400">Following</span>
              </div>
            </div>
            <p className="text-gray-300">Email: {user.email}</p>
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
                    <h3 className="text-xl text-[#279B7B] font-semibold mb-2">
                      {post.title}
                    </h3>
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

        {/* Right sidebar - Settings and Following */}
        <div className="space-y-6">
          {/* Settings Section */}
          <Link href="/" className="text-blue-500 hover:underline mb-6 block">
            ← Back to Feed
          </Link>
          <div className="bg-[#17191a] rounded-lg p-6">
            <h2 className="text-xl font-bold text-[#279B7B] mb-4">
              Profile Settings
            </h2>

            {successMessage && (
              <div className="bg-green-900/50 border border-green-500 text-green-100 px-4 py-2 rounded mb-4">
                {successMessage}
              </div>
            )}

            {/* Name Change */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-2">Change Name</h3>
              {editingName ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                  />
                  {nameError && (
                    <p className="text-red-500 text-sm">{nameError}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={handleNameSubmit}
                      className="px-4 py-2 bg-[#279B7B] text-white rounded hover:bg-[#1e8b6a]"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingName(false);
                        setNewName(user.name);
                        setNameError(null);
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setEditingName(true)}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  Edit Name
                </button>
              )}
            </div>

            {/* Password Change */}
            <div>
              <h3 className="text-white font-semibold mb-2">Change Password</h3>
              {showPasswordForm ? (
                <form onSubmit={handlePasswordSubmit} className="space-y-3">
                  <div>
                    <input
                      type="password"
                      placeholder="Current Password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="New Password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                      required
                    />
                  </div>
                  {passwordError && (
                    <p className="text-red-500 text-sm">{passwordError}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#279B7B] text-white rounded hover:bg-[#1e8b6a]"
                    >
                      Update Password
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordForm({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                        setPasswordError(null);
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  Change Password
                </button>
              )}
            </div>
          </div>

          {/* Following Section */}
          <div className="bg-[#17191a] rounded-lg p-6">
            <h2 className="text-xl font-bold text-[#279B7B] mb-4">Following</h2>
            {followedUsers.length === 0 ? (
              <p className="text-gray-400 text-center">
                Not following anyone yet
              </p>
            ) : (
              <div className="space-y-3">
                {followedUsers.map((followedUser) => (
                  <div
                    key={followedUser.id}
                    onClick={() => router.push(`/users/${followedUser.id}`)}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
                  >
                    <span className="text-white">{followedUser.name}</span>
                    <div className="text-sm text-gray-400">
                      {followedUser._count.posts} posts
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
