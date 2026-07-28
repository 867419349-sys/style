"use client";

import { useI18n } from "@/lib/i18n";
import { BRAND } from "./Header";

export function Footer() {
  const { pick } = useI18n();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-8 text-xs text-muted sm:flex-row">
        <span className="font-display text-base text-ink">{BRAND}</span>
        <span>
          {pick(
            "AI 驱动的设计风格分析 · 硅基流动多模型生图",
            "AI-powered design style analysis · SiliconFlow multi-model generation",
          )}
        </span>
      </div>
    </footer>
  );
}
