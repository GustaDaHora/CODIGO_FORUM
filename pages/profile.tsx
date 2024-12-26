// pages/profile.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
  name: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      router.replace("/auth/signin"); // Redirect to login page if no token is found
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
      } catch (error) {
        console.error(error);
        Cookies.remove("token");
        router.replace("/auth/signin"); // Redirect to login if token validation fails
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Failed to load user data.</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {user.email}</p>
      <p>Name: {user.name}</p>
      {/* Add more user information fields as needed */}
    </div>
  );
};

export default ProfilePage;
