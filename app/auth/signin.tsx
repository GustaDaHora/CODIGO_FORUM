"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";


const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/auth/signin", {
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

      // Store token in cookie instead of localStorage
      Cookies.set("token", result.token, { expires: 1 }); // expires in 1 day

      router.push("/");
    } catch (error) {
      console.error(error);
      setError(
        "Failed to sign in. Please check your credentials and try again."
      );
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Log In</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default SignIn;
