"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Hero() {
  const { t } = useI18n();
  return (
    <section id="top" className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(230,126,91,0.45), rgba(244,194,161,0.15) 60%, transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">
          <Sparkles size={13} className="text-accent" />
          {t("brandTag")}
        </div>

        <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[1.05] tracking-tight sm:text-7xl">
          {t("heroTitle")}
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          {t("heroSub")}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#studio"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
          >
            {t("ctaUpload")}
            <ArrowRight size={16} />
          </a>
          <a
            href="#gallery"
            className="inline-flex items-center gap-2 rounded-full border border-border-strong px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface"
          >
            {t("ctaBrowse")}
          </a>
        </div>
      </div>
    </section>
  );
}
