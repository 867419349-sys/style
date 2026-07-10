"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import type { StyleResult } from "@/types";
import { useI18n } from "@/lib/i18n";
import { PaletteSwatches } from "./PaletteSwatches";
import { CopyTabs } from "./CopyTabs";
import { ModelCompareGrid } from "./ModelCompareGrid";

interface Props {
  style: StyleResult;
  /** show a "extracted from your image" banner (result page) */
  fromUpload?: boolean;
}

export function StyleDetail({ style, fromUpload = false }: Props) {
  const { pick, t } = useI18n();
  const [activeIdx, setActiveIdx] = useState(0);
  const activeImage = style.images[activeIdx] ?? style.image;
  const total = style.images.length;
  const hasMultiple = total > 1;
  const go = (dir: number) =>
    setActiveIdx((i) => (i + dir + total) % total);

  const dragStart = useRef<number | null>(null);
  function onPointerDown(e: React.PointerEvent) {
    dragStart.current = e.clientX;
  }
  function onPointerUp(e: React.PointerEvent) {
    if (dragStart.current === null) return;
    const dx = e.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link
        href={fromUpload ? "/#studio" : "/#gallery"}
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft size={15} />
        {pick("返回", "Back")}
      </Link>

      {fromUpload && (
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent-2 bg-accent-2/25 px-3 py-1.5 text-xs font-medium text-accent-ink">
          <Sparkles size={13} />
          {pick("从你上传的图片提取", "Extracted from your image")}
        </div>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div
          className="group relative h-64 select-none overflow-hidden rounded-3xl border border-line sm:h-80 lg:h-full lg:min-h-[22rem]"
          style={{ background: style.thumb }}
          onPointerDown={hasMultiple ? onPointerDown : undefined}
          onPointerUp={hasMultiple ? onPointerUp : undefined}
        >
          {activeImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeImage}
              alt={pick(style.name_zh, style.name_en)}
              draggable={false}
              className="h-full w-full object-cover"
            />
          )}

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={pick("上一张", "Previous")}
                className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface/80 text-ink opacity-0 backdrop-blur transition-opacity hover:bg-surface group-hover:opacity-100"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={pick("下一张", "Next")}
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface/80 text-ink opacity-0 backdrop-blur transition-opacity hover:bg-surface group-hover:opacity-100"
              >
                <ChevronRight size={18} />
              </button>
              <div className="absolute right-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-xs font-medium text-white">
                {activeIdx + 1} / {total}
              </div>
              <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
                {style.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    aria-label={pick(`第 ${i + 1} 张`, `Image ${i + 1}`)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === activeIdx ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex gap-1 bg-gradient-to-t from-black/30 to-transparent p-4">
            {style.palette.map((s) => (
              <span
                key={s.hex}
                className="h-2 flex-1 rounded-full"
                style={{ background: s.hex }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <h1 className="font-display text-4xl leading-tight sm:text-5xl">
              {pick(style.name_zh, style.name_en)}
            </h1>
            <p className="mt-2 text-muted">
              {pick(style.tagline_zh, style.tagline_en)}
            </p>
          </div>
          <PaletteSwatches palette={style.palette} />
          <CopyTabs style={style} />
        </div>
      </div>

      {style.images.length > 0 && (
        <div className="mt-6">
          <h2 className="font-display text-2xl">
            {pick("参考图片", "Reference images")}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {pick(
              `该风格的 ${style.images.length} 张参考图，点击可在上方大图切换预览。`,
              `${style.images.length} reference images — click one to preview it above.`,
            )}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {style.images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveIdx(i)}
                aria-pressed={i === activeIdx}
                className={`overflow-hidden rounded-xl border transition-all ${
                  i === activeIdx
                    ? "border-accent ring-2 ring-accent/40"
                    : "border-line hover:-translate-y-0.5 hover:border-border-strong"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${pick(style.name_zh, style.name_en)} ${i + 1}`}
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
        <h2 className="font-display text-2xl">
          {pick("示例应用", "Example application")}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {pick(
            "用该风格的配色快速预览一个卡片布局。",
            "A quick card preview using this style's palette.",
          )}
        </p>
        <ExampleApplication style={style} />
      </div>

      <div className="mt-4">
        <ModelCompareGrid style={style} />
      </div>

      <p className="mt-2 text-center text-xs text-muted">
        {t("mockBadge")}
      </p>
    </div>
  );
}

function ExampleApplication({ style }: { style: StyleResult }) {
  const { pick } = useI18n();
  const p = style.palette;
  const bg = p[0]?.hex ?? "#ffffff";
  const accent = p[Math.min(2, p.length - 1)]?.hex ?? "#000000";
  const ink = p[p.length - 1]?.hex ?? "#111111";

  return (
    <div
      className="mt-4 grid gap-4 rounded-2xl p-6 sm:grid-cols-3"
      style={{ background: bg, color: ink }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-xl p-4"
          style={{ background: "rgba(255,255,255,0.5)", border: `1px solid ${accent}` }}
        >
          <div
            className="mb-3 h-16 rounded-lg"
            style={{ background: `linear-gradient(135deg, ${p[i % p.length]?.hex}, ${accent})` }}
          />
          <div className="font-display text-lg" style={{ color: ink }}>
            {pick("标题文本", "Heading")}
          </div>
          <div className="mt-1 text-xs opacity-70">
            {pick("这是一段示例正文，用于预览该风格的配色搭配。", "Sample body text previewing this palette.")}
          </div>
          <div
            className="mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium"
            style={{ background: accent, color: bg }}
          >
            {pick("按钮", "Button")}
          </div>
        </div>
      ))}
    </div>
  );
}
