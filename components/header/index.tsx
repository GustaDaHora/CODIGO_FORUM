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
          <button className="botaoCadastrar">CADASTRAR</button>
          <button className="botaoHeader">
            <FiLogIn className="iconeLogin" />
            Login
          </button>
        </nav>
      </div>
    </header>
  );
}
