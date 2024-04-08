import { useRouter } from "next/router";
import { useState, FormEvent, ChangeEvent } from "react";
import Footer from "@/components/footer";

export default function Signup() {
  const router = useRouter();
  const [name, SetName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (name === "" || email === "" || password === "") {
        setError("Informações inválidas, verifique e tente novamente!");
        return;
      }
      const response = await fetch("/api/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("User created:", data.user);
        window.alert("Usuario criado!");
        router.push("/login");
      } else {
        console.error("Failed to create user");
        setError("Falha ao criar usuário, tente novamente mais tarde.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setError("Falha ao criar usuário, tente novamente mais tarde.");
    }
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    SetName(e.target.value);
    setError("");
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError("");
  };

  return (
    <main>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input
          required
          type="text"
          placeholder="Username"
          value={name}
          onChange={handleUsernameChange}
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
      <Footer />
    </main>
  );
}
