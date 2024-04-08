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
          <Link href="/signup">
            <button className="botaoCadastrar">CADASTRAR</button>
          </Link>
          <Link href="/login">
            <button className="botaoHeader">
              <FiLogIn className="iconeLogin" />
              Login
            </button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
