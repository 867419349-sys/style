import { STYLES } from "@/lib/styles";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StylePageView } from "@/components/StylePageView";

export function generateStaticParams() {
  return STYLES.map((s) => ({ id: s.id }));
}

export default async function StylePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Header />
      <main className="flex-1">
        <StylePageView id={id} />
      </main>
      <Footer />
    </>
  );
}
