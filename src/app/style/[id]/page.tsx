import { notFound } from "next/navigation";
import { getStyleById, STYLES } from "@/lib/styles";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StyleDetail } from "@/components/StyleDetail";

export function generateStaticParams() {
  return STYLES.map((s) => ({ id: s.id }));
}

export default async function StylePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const style = getStyleById(id);
  if (!style) notFound();

  return (
    <>
      <Header />
      <main className="flex-1">
        <StyleDetail style={style} />
      </main>
      <Footer />
    </>
  );
}
