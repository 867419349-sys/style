import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CompareDetail } from "@/components/CompareDetail";

export default async function ComparePage({
  params,
}: {
  params: Promise<{ styleId: string; modelId: string }>;
}) {
  const { styleId, modelId } = await params;

  return (
    <>
      <Header />
      <main className="flex-1">
        <CompareDetail styleId={styleId} modelId={modelId} />
      </main>
      <Footer />
    </>
  );
}
