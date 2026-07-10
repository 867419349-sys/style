import Link from "next/link";
import { getStyleById } from "@/lib/styles";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StyleDetail } from "@/components/StyleDetail";

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ style?: string }>;
}) {
  const { style: id } = await searchParams;
  const style = id ? getStyleById(id) : undefined;

  return (
    <>
      <Header />
      <main className="flex-1">
        {style ? (
          <StyleDetail style={style} fromUpload />
        ) : (
          <div className="mx-auto max-w-3xl px-5 py-24 text-center">
            <h1 className="font-display text-3xl">还没有提取结果</h1>
            <p className="mt-3 text-muted">
              请先上传一张图片来提取设计风格。
            </p>
            <Link
              href="/#studio"
              className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-medium text-bg"
            >
              去上传图片
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
