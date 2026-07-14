import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ResultView } from "@/components/ResultView";

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ style?: string }>;
}) {
  const { style: id } = await searchParams;

  return (
    <>
      <Header />
      <main className="flex-1">
        <ResultView id={id} />
      </main>
      <Footer />
    </>
  );
}
