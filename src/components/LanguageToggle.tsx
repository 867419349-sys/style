"use client";

import { useI18n } from "@/lib/i18n";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <div
      className={`inline-flex items-center rounded-full border border-line bg-surface p-0.5 text-xs font-medium ${className}`}
    >
      <button
        type="button"
        onClick={() => setLang("zh")}
        aria-pressed={lang === "zh"}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          lang === "zh" ? "bg-ink text-bg" : "text-muted hover:text-ink"
        }`}
      >
        中文
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          lang === "en" ? "bg-ink text-bg" : "text-muted hover:text-ink"
        }`}
      >
        EN
      </button>
    </div>
  );
}
