import "./index.css";
import { CiLogin } from "react-icons/ci";

export default function Header() {
  return (
    <header className="backgroundHeader">
      <nav className="botoes"><button className="botaoCadastrar">Cadastrar</button> <button className="login"><CiLogin className="botaoLogin"/>Login</button></nav>
      <div className="logo1"> <h2>Papo</h2>  <h1>Olympus</h1> </div>

    </header>
  );
}
