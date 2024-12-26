"use client";

import Link from "next/link";
import Logo from "@/components/logo";
import "./index.css";
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

  const handleSignout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    router.replace("/"); // Redirect to home page or login page after signout
  };

  return (
    <header className="header">
      <div className="conteudoHeader">
        <Logo />
        <nav className="botoesHeader">
          <a href="/">
            <button className="botaoHeader">Recentes</button>
          </a>
          <a href="/">
            <button className="botaoHeader">Relevantes</button>
          </a>
          <a href="/">
            <button className="botaoHeader">Sem Resposta</button>
          </a>
          {!isAuthenticated && (
            <>
              <Link href="/auth/register" passHref>
                <button className="botaoHeader">Cadastro</button>
              </Link>
              <Link href="/auth/signin" passHref>
                <button className="botaoHeader">
                  <FiLogIn className="iconeLogin" />
                  Login
                </button>
              </Link>
            </>
          )}
          {isAuthenticated && (
            <>
              <Link href="/profile" passHref>
                <button className="botaoHeader">Meu Perfil</button>
              </Link>
              <button className="botaoHeader" onClick={handleSignout}>
                <FiLogOut className="iconeLogin" />
                Sign Out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
