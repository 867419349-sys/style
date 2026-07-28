"use client";

import Link from "next/link";
import type { StyleResult } from "@/types";
import { useI18n } from "@/lib/i18n";
import { X } from "lucide-react";

interface Props {
  style: StyleResult;
  onDelete?: () => void;
}

export function StyleCard({ style, onDelete }: Props) {
  const { pick } = useI18n();

  return (
    <Link
      href={`/style/${style.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line text-left transition-all hover:-translate-y-1 hover:border-border-strong"
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
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
          className="absolute right-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500"
        >
          <X size={11} />
        </button>
      )}
    </Link>
  );
}
