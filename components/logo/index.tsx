export default function Logo() {
  return (
    <div className="cursor-pointer block h-[75px]">
      <a href="/">
        <h2 className="text-[#279B7B] text-[var(--tamanho-medio)] rotate-[-10deg] tracking-wider mt-3 transition duration-500 hover:text-[var(--cor-hover)]">
          Papo
        </h2>
        <h1 className="text-[#40BE9B] text-[var(--tamanho-h3)] translate-x-[25px] translate-y-[-10px] transition duration-500 hover:text-[var(--cor-hover)]">
          Olympus
        </h1>
      </a>
    </div>
  );
}
