export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full h-20 bg-[var(--cor-footer)] flex flex-col justify-center items-center shadow-lg">
      <div className="flex gap-4 mb-1.5">
        <button className="inline-flex items-center rounded hover:text-[var(--cor-hover)] transition-colors duration-500 text-[var(--cor-principal)] text-[var(--tamanho-medio)]">Contato</button>
        <button className="inline-flex items-center rounded hover:text-[var(--cor-hover)] transition-colors duration-500 text-[var(--cor-principal)] text-[var(--tamanho-medio)]">FAQ</button>
        <button className="inline-flex items-center rounded hover:text-[var(--cor-hover)] transition-colors duration-500 text-[var(--cor-principal)] text-[var(--tamanho-medio)]">Sobre</button>
        <button className="inline-flex items-center rounded hover:text-[var(--cor-hover)] transition-colors duration-500 text-[var(--cor-principal)] text-[var(--tamanho-medio)]">Política de Privacidade</button>
        <button className="inline-flex items-center rounded hover:text-[var(--cor-hover)] transition-colors duration-500 text-[var(--cor-principal)] text-[var(--tamanho-medio)]">Termos de Uso</button>
      </div>
      <div>
        <p className="m-0 text-xs text-[var(--cor-tags)]">
          Papo Olympus 2024 &copy; Todos direitos reservados
        </p>
      </div>
    </footer>
  );
}
