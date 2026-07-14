"use client";

import Link from "next/link";
import { AlertCircle, Download, Loader2, Maximize2 } from "lucide-react";
import type { ModelResult, ModelSpec } from "@/types";
import { useI18n } from "@/lib/i18n";

interface Props {
  model: ModelSpec;
  result: ModelResult | undefined;
  href?: string;
}

export function ModelCard({ model, result, href }: Props) {
  const { pick } = useI18n();
  const loading = result?.status === "loading";
  const done = result?.status === "done";
  const errored = result?.status === "error";

  const media = (
    <div className="relative aspect-square w-full">
      {done && result?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={result.image}
          alt={model.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-2 px-3 text-center">
          {loading ? (
            <Loader2 size={26} className="animate-spin text-muted" />
          ) : errored ? (
            <>
              <AlertCircle size={22} className="text-accent-ink" />
              <span className="text-[11px] leading-tight text-muted">
                {result?.error ?? pick("生成失败", "Generation failed")}
              </span>
            </>
          ) : (
            <div
              className="h-10 w-10 rounded-full opacity-40"
              style={{
                background: `linear-gradient(135deg, ${model.swatch[0]}, ${model.swatch[1]})`,
              }}
            />
          )}
        </div>
      )}
      {done && (
        <div className="absolute bottom-2 right-2 flex gap-1.5">
          {href && (
            <span className="inline-flex items-center gap-1 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-medium text-bg backdrop-blur transition-colors group-hover:bg-ink">
              <Maximize2 size={12} />
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (result?.image) window.open(result.image, "_blank", "noopener");
            }}
            className="inline-flex items-center gap-1 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-medium text-bg backdrop-blur transition-colors hover:bg-ink"
          >
            <Download size={12} />
          </button>
        </div>
      )}
    </div>
  );

  const foot = (
    <div className="flex items-center gap-2 px-3 py-2.5">
      <span
        className="h-6 w-6 shrink-0 rounded-md"
        style={{
          background: `linear-gradient(135deg, ${model.swatch[0]}, ${model.swatch[1]})`,
        }}
      />
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{model.name}</div>
        <div className="truncate text-[11px] text-muted">
          {pick(model.vendor_zh, model.vendor_en)}
        </div>
      </div>
    </div>
  );

  if (done && href) {
    return (
      <Link
        href={href}
        className="group block overflow-hidden rounded-2xl border border-line bg-surface transition-all hover:-translate-y-1 hover:border-border-strong"
      >
        {media}
        {foot}
      </Link>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      {media}
      {foot}
    </div>
  );
}
