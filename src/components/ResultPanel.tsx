"use client";

import type { StyleResult } from "@/types";
import { useI18n } from "@/lib/i18n";
import { PaletteSwatches } from "./PaletteSwatches";
import { CopyTabs } from "./CopyTabs";

export function ResultPanel({ style }: { style: StyleResult | null }) {
  const { t, pick } = useI18n();

  if (!style) {
    return (
      <div className="flex h-full min-h-64 items-center justify-center rounded-2xl border border-dashed border-line bg-surface/50 p-8 text-center text-sm text-muted">
        {t("emptyResult")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-4">
        <span
          className="h-14 w-14 shrink-0 rounded-xl border border-black/10"
          style={{ background: style.thumb }}
        />
        <div>
          <h3 className="font-display text-2xl leading-tight">
            {pick(style.name_zh, style.name_en)}
          </h3>
          <p className="mt-1 text-sm text-muted">
            {pick(style.tagline_zh, style.tagline_en)}
          </p>
        </div>
      </div>

      <PaletteSwatches palette={style.palette} />
      <CopyTabs style={style} />
    </div>
  );
}
