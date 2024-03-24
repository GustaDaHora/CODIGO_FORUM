import Logo from "@/components/logo";
import "./index.css";
import { CiLogin } from "react-icons/ci";

export default function Header() {
  return (
    <header className="header">
      <Logo />
      <nav className="botoes">
        <button className="botaoCadastrar">Cadastrar</button>
        <button className="botaoLogin"><CiLogin className="iconeLogin" />Login</button>
      </nav>
      
    </header>
  );
}
