"use client";

import Link from "next/link";
import type { StyleResult } from "@/types";
import { useI18n } from "@/lib/i18n";

export function StyleCard({ style }: { style: StyleResult }) {
  const { pick } = useI18n();
  return (
    <Link
      href={`/style/${style.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line text-left transition-all hover:-translate-y-1 hover:border-border-strong"
    >
      <div className="relative h-32 w-full" style={{ background: style.thumb }}>
        {style.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={style.image}
            alt={pick(style.name_zh, style.name_en)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 flex gap-0.5 p-2">
          {style.palette.map((s) => (
            <span
              key={s.hex}
              className="h-1.5 flex-1 rounded-full"
              style={{ background: s.hex }}
            />
          ))}
        </div>
      </div>
      <div className="bg-surface px-4 py-3">
        <div className="font-medium leading-tight">
          {pick(style.name_zh, style.name_en)}
        </div>
        <div className="mt-1 text-xs text-muted">
          {pick(style.tagline_zh, style.tagline_en)}
        </div>
      </div>
    </Link>
  );
}
