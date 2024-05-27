import Link from "next/link";
import Logo from "@/components/logo";
import "./index.css";
import { FiLogIn } from "react-icons/fi";

export default function Header() {
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
          <Link href="/auth/register" passHref>
            CADASTRA
          </Link>
          <Link href="/auth/signin" passHref>
            <FiLogIn className="iconeLogin" />
            Login
          </Link>
          <Link href="/profile">Meu Perfil</Link>
        </nav>
      </div>
    </header>
  );
}
