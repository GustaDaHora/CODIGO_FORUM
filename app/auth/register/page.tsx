// pages/auth/register.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Register = () => {
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      router.push("/auth/login");
    } else {
      console.error(await res.json());
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-[#1A202C] rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-white mb-6">Register</h1>
      
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-100 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-white mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-white mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--cor-principal)] text-white py-2 px-4 rounded-lg 
                   hover:bg-[var(--cor-links)] transition-colors duration-300 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div className="mt-4 text-center text-white">
        <p>
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[var(--cor-links)] hover:text-[var(--cor-hover)]">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
