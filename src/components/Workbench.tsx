"use client";

import { useState } from "react";
import type { StyleResult } from "@/types";
import { useI18n } from "@/lib/i18n";
import { StyleGallery } from "./StyleGallery";
import { UploadDropzone } from "./UploadDropzone";
import { ExtractModal } from "./ExtractModal";

export function Workbench() {
  const { t, pick } = useI18n();
  const [result, setResult] = useState<StyleResult | null>(null);

  function handleResult(style: StyleResult) {
    try {
      sessionStorage.setItem("zomo:last-extract", JSON.stringify(style));
    } catch {
      // sessionStorage 不可用时忽略
    }
    setResult(style);
  }

  return (
    <>
      <StyleGallery />

      <section
        id="studio"
        className="scroll-mt-20 border-y border-line bg-surface-2/40"
      >
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-8">
            <h2 className="font-display text-3xl sm:text-4xl">{t("studioTitle")}</h2>
            <p className="mt-2 max-w-xl text-sm text-muted">{t("studioSub")}</p>
          </div>
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <UploadDropzone onResult={handleResult} />
            <ul className="space-y-4 text-sm text-muted">
              {[
                pick("① 拖入或选择一张界面 / 插画图片", "① Drop or pick a UI / illustration image"),
                pick("② 自动分析并生成风格提示词与配色", "② Auto-analyze into a style prompt + palette"),
                pick("③ 弹窗展示结果，可复制 Markdown / CSS / Prompt", "③ Modal shows result — copy Markdown / CSS / Prompt"),
                pick("④ 一键用多个文生图模型对比效果", "④ Compare across text-to-image models in one click"),
              ].map((line, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-display text-lg text-ink">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {result && (
        <ExtractModal style={result} onClose={() => setResult(null)} />
      )}
    </>
  );
}
