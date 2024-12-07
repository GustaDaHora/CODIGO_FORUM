import "./index.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerLinks">
        <button className="footerLink">Contato</button>
        <button className="footerLink">FAQ</button>
        <button className="footerLink">Sobre</button>
        <button className="footerLink">Política de Privacidade</button>
        <button className="footerLink">Termos de Uso</button>
      </div>
      <div className="footerDescricao">
        <p className="direitos">
          Papo Olympus 2024 &copy; Todos direitos reservados
        </p>
      </div>
    </footer>
  );
}
