"use client";

import Link from "next/link";
import Logo from "@/components/logo";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    router.replace("/"); // Redirect to home page or login page after logout
  };

  return (
    <header className="relative top-0 left-0 flex justify-center items-center w-full h-[75px] bg-gradient-to-b from-black to-[#2D3532]">
      <div className="w-4/5 flex justify-between items-center">
        <Logo />
        <nav className="flex gap-4 items-center">
          <Link href="/" className="text-gray-300 hover:text-white transition duration-300">Recents</Link>
          <Link href="/" className="text-gray-300 hover:text-white transition duration-300">Relevant</Link>
          <Link href="/" className="text-gray-300 hover:text-white transition duration-300">No answers</Link>

          {!isAuthenticated ? (
            <>
              <Link href="/auth/register">
                <button className="bg-[var(--cor-principal)] text-white px-4 py-2 rounded-lg font-semibold shadow-md transition duration-400 hover:bg-[var(--cor-links)]">
                Register
                </button>
              </Link>
              <Link href="/auth/login">
                <button className="flex items-center text-[var(--cor-links)] text-lg transition duration-500 hover:text-[var(--cor-hover)]">
                  <FiLogIn className="mr-2 text-xl font-semibold" />
                  Login
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/posts/create">
                <button className="text-[var(--cor-links)] text-lg transition duration-500 hover:text-[var(--cor-hover)]">
                  Create Post
                </button>
              </Link>
              <Link href="/profile">
                <button className="text-[var(--cor-links)] text-lg transition duration-500 hover:text-[var(--cor-hover)]">
                  My profile
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-[var(--cor-links)] text-lg transition duration-500 hover:text-[var(--cor-hover)]"
              >
                <FiLogOut className="mr-2 text-xl font-semibold" />
                Log Out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
