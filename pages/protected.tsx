"use client";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function ProtectedPage() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      router.replace("/"); // If no token is found, redirect to login page
      return;
    }

    // Validate the token by making an API call
    const validateToken = async () => {
      try {
        const res = await fetch("/api/auth/protected", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Token validation failed");
      } catch (error) {
        console.error(error);
        router.replace("/auth/signin"); // Redirect to login if token validation fails
      }
    };

    validateToken();
  }, [router]);

  return <div>Protected Content</div>;
}

export default ProtectedPage;
