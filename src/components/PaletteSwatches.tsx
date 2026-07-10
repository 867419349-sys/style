"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { Swatch } from "@/types";
import { useI18n } from "@/lib/i18n";

export function PaletteSwatches({ palette }: { palette: Swatch[] }) {
  const { t, pick } = useI18n();
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1500);
    } catch {
      /* clipboard may be unavailable */
    }
  }

  return (
    <div>
      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
        {t("palette")}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {palette.map((s) => (
          <button
            key={s.hex}
            type="button"
            onClick={() => copy(s.hex)}
            title={t("copy")}
            className="flex items-center gap-2 rounded-xl border border-line bg-surface p-2 text-left transition-colors hover:border-border-strong"
          >
            <span
              className="h-8 w-8 shrink-0 rounded-lg border border-black/10"
              style={{ background: s.hex }}
            />
            <span className="min-w-0">
              <span className="flex items-center gap-1 font-mono text-xs">
                {s.hex}
                {copied === s.hex && <Check size={12} className="text-accent-ink" />}
              </span>
              <span className="block truncate text-[11px] text-muted">
                {pick(s.role_zh, s.role_en)}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
