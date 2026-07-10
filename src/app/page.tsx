import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Workbench } from "@/components/Workbench";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Workbench />
      </main>
      <Footer />
    </>
  );
}
