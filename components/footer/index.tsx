import "./index.css";
import { FaRegCopyright } from "react-icons/fa";

export default function footer() {
  return (
   <footer>
    <table className="atributos">
     <tr>
      <td>Contato</td>
      <td>FAQ</td>
      <td>Sobre</td>
      <td>Política de privacidade</td>
      <td>Termos de uso</td>
     </tr>
    </table>
    <div className="direitos">Papo Olympus <FaRegCopyright className="copy" /> Todos direitos reservados</div>
   </footer>
  );
}
