// app/auth/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
	
      const result = await response.json();
      
      if (!response.ok) {
        setError(result.message || "Login failed");
        return;
      }

      // Use the login function from auth context
      login(result.data.token, result.data.user);
      router.push(redirectPath);
    } catch (error) {
      console.error(error);
      setError("Failed to login. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-[#1A202C] rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-white mb-6">Log In</h1>
      
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-100 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[--cor-principal]"
            required
          />
        </div>
        
        <div>
          <label className="block text-white mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[--cor-principal]"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--cor-principal)] text-[--cor-tags] text-xl font-bold py-2 px-4 rounded-lg 
                   hover:bg-[var(--cor-links)] transition-colors duration-300 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
      
      <div className="mt-4 text-center text-white">
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-[var(--cor-links)] hover:text-[var(--cor-hover)]">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}