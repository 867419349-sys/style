"use client";

import { useEffect, useRef, useState } from "react";
import { BookmarkPlus, Check, Copy, FolderPlus, Library, Loader2, Wand2, X } from "lucide-react";
import type { ModelResult, StyleResult } from "@/types";
import { useI18n } from "@/lib/i18n";
import { MODELS, generateWithModel } from "@/lib/imagegen";
import { getLibraries, createLibrary, addToDefault } from "@/lib/userStyles";
import type { UserLibrary } from "@/lib/userStyles";
import { PaletteSwatches } from "./PaletteSwatches";

interface Props {
  style: StyleResult;
  onClose: () => void;
}

function CopyBtn({
  label,
  content,
}: {
  label: string;
  content: string;
}) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(content);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium transition-colors hover:border-border-strong"
    >
      {done ? <Check size={13} className="text-accent-ink" /> : <Copy size={13} />}
      {label}
    </button>
  );
}

export function ExtractModal({ style, onClose }: Props) {
  const { t, pick } = useI18n();
  const preview = style.image ?? style.images?.[0];
  const [genResults, setGenResults] = useState<Record<string, ModelResult>>({});
  const [genRunning, setGenRunning] = useState(false);
  const [saved, setSaved] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [showNewLibInput, setShowNewLibInput] = useState(false);
  const [libName, setLibName] = useState("");
  const [libraries, setLibraries] = useState<UserLibrary[]>(() => {
    if (typeof window === "undefined") return [];
    return getLibraries();
  });
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
        setShowNewLibInput(false);
      }
    }
    if (popoverOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [popoverOpen]);

  function refreshLibs() {
    setLibraries(getLibraries());
  }

  function handleNewLibrary() {
    if (!libName.trim()) return;
    createLibrary(libName.trim(), style);
    setSaved(true);
    setPopoverOpen(false);
    setShowNewLibInput(false);
    setLibName("");
    refreshLibs();
  }

  function handleAddToDefault() {
    addToDefault(style);
    setSaved(true);
    setPopoverOpen(false);
    refreshLibs();
  }

  async function runGen() {
    setGenRunning(true);
    setGenResults(
      Object.fromEntries(
        MODELS.map((m) => [m.id, { modelId: m.id, status: "loading", image: "" } as ModelResult]),
      ),
    );
    await Promise.all(
      MODELS.map(async (m) => {
        const r = await generateWithModel(style.prompt, m.apiModel);
        setGenResults((prev) => ({
          ...prev,
          [m.id]: {
            modelId: m.id,
            status: r.url ? "done" : "error",
            image: r.url ?? "",
            error: r.error,
          },
        }));
      }),
    );
    setGenRunning(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* 按下 Esc 关闭 */}
      <div
        className="relative flex w-full max-w-6xl max-h-[85vh] overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      >
        {/* 关闭按钮 */}
        <button
          type="button"
          onClick={onClose}
          aria-label={pick("关闭", "Close")}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface/90 text-muted transition-colors hover:text-ink"
        >
          <X size={16} />
        </button>

        {/* 左：图片 */}
        <div className="hidden w-[42%] shrink-0 bg-surface-2 md:block">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt={pick(style.name_zh, style.name_en)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{ background: style.thumb }}
            />
          )}
        </div>

        {/* 右：风格信息 */}
        <div className="flex flex-1 flex-col gap-2.5 overflow-auto p-5">
          {/* 小屏时显示图片 */}
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt={pick(style.name_zh, style.name_en)}
              className="h-40 w-full rounded-xl object-cover md:hidden"
            />
          )}

          {/* 风格标题 */}
          <div>
            <div className="text-xs uppercase tracking-wide text-muted">
              {t("tabDesc")}
            </div>
            <h2 className="mt-0.5 font-display text-xl leading-tight">
              {pick(style.name_zh, style.name_en)}
            </h2>
            {style.tagline_zh && (
              <p className="mt-0.5 text-xs text-muted">
                {pick(style.tagline_zh, style.tagline_en)}
              </p>
            )}
          </div>

          {/* 中文描述 */}
          <p className="line-clamp-2 text-sm leading-relaxed text-muted">
            {pick(style.description_zh, style.description_en)}
          </p>

          {/* 配色 */}
          <PaletteSwatches palette={style.palette} />

          {/* 复制按钮 */}
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
              {t("copy")}
            </div>
            <div className="flex flex-wrap gap-2">
              <CopyBtn label="Markdown" content={style.markdown} />
              <CopyBtn label="CSS" content={style.css} />
              <CopyBtn label="Prompt" content={style.prompt} />
            </div>
          </div>

          {/* 加入风格库 */}
          <div ref={popoverRef} className="relative self-start">
            <button
              type="button"
              onClick={() => { if (!saved) { refreshLibs(); setPopoverOpen(!popoverOpen); } }}
              disabled={saved}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                saved
                  ? "border-accent-2 bg-accent-2/20 text-accent-ink"
                  : "border-line hover:border-border-strong"
              }`}
            >
              {saved ? <Check size={13} /> : <BookmarkPlus size={13} />}
              {saved ? pick("已加入风格库", "Saved to library") : pick("加入风格库", "Save to library")}
            </button>
            {popoverOpen && !saved && (
              <div className="absolute bottom-full left-0 mb-2 w-48 rounded-xl border border-line bg-surface p-1.5 shadow-lg">
                {showNewLibInput ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={libName}
                      onChange={(e) => setLibName(e.target.value)}
                      placeholder={pick("输入风格库名称…", "Library name…")}
                      className="rounded-lg border border-line bg-surface-2 px-2.5 py-1.5 text-xs outline-none focus:border-accent"
                      autoFocus
                      onKeyDown={(e) => { if (e.key === "Enter") handleNewLibrary(); if (e.key === "Escape") setShowNewLibInput(false); }}
                    />
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={handleNewLibrary}
                        disabled={!libName.trim()}
                        className="flex-1 rounded-lg bg-ink px-2 py-1.5 text-xs font-medium text-bg disabled:opacity-40"
                      >
                        {pick("创建", "Create")}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowNewLibInput(false); setLibName(""); }}
                        className="rounded-lg border border-line px-2 py-1.5 text-xs text-muted"
                      >
                        {pick("取消", "Cancel")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => setShowNewLibInput(true)}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors hover:bg-surface-2"
                    >
                      <FolderPlus size={14} className="text-accent-ink" />
                      {pick("新增风格库", "New library")}
                    </button>
                    <div className="my-0.5 border-t border-line" />
                    <button
                      type="button"
                      onClick={handleAddToDefault}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors hover:bg-surface-2"
                    >
                      <Library size={14} className="text-muted" />
                      {pick("加入现有风格库", "Add to existing gallery")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 生图 */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                {pick("生图对比", "Generate & Compare")}
              </span>
              <button
                type="button"
                onClick={runGen}
                disabled={genRunning}
                className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-bg transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-60"
              >
                {genRunning ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Wand2 size={12} />
                )}
                {genRunning
                  ? pick("生成中…", "Generating…")
                  : Object.keys(genResults).length
                    ? pick("重新生成", "Regenerate")
                    : pick("生成图片", "Generate")}
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {MODELS.map((m) => {
                const r = genResults[m.id];
                return (
                  <div
                    key={m.id}
                    className="overflow-hidden rounded-lg border border-line bg-surface-2"
                  >
                    <div className="aspect-[5/4] w-full">
                      {r?.status === "done" && r.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.image}
                          alt={m.name}
                          className="h-full w-full object-cover"
                        />
                      ) : r?.status === "loading" ? (
                        <div className="flex h-full w-full items-center justify-center">
                          <Loader2 size={20} className="animate-spin text-muted" />
                        </div>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <div
                            className="h-8 w-8 rounded-full opacity-30"
                            style={{
                              background: `linear-gradient(135deg, ${m.swatch[0]}, ${m.swatch[1]})`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1.5">
                      <span
                        className="h-3 w-3 shrink-0 rounded"
                        style={{
                          background: `linear-gradient(135deg, ${m.swatch[0]}, ${m.swatch[1]})`,
                        }}
                      />
                      <span className="truncate text-[10px] font-medium">{m.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 底部提示 */}
          <p className="text-[11px] text-muted">
            {pick(
              `风格由 AI 分析生成，配色可点击单个色块复制 hex。`,
              `Style analyzed by AI. Click a palette swatch to copy its hex.`,
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
