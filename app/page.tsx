export const dynamic = "force-dynamic";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Main from "@/pages/main";

export default function Home() {
  return (
    <main>
      <Header />
      <Main />
      <Footer />
    </main>
  );
}
