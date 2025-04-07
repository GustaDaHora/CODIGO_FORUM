export const dynamic = "force-dynamic";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Main from "@/app/dashboard/page";
import "./globals.css";

export default function Home() {
  return (
    <main>
      <Header />
      <Main />
      <Footer />
    </main>
  );
}
