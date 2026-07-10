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
            "设计风格提取原型 · 示例数据，未接入真实模型",
            "Design style extractor prototype · sample data, no live model",
          )}
        </span>
      </div>
    </footer>
  );
}
