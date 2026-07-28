"use client";

import { useEffect, useRef, useState } from "react";
import { BookmarkPlus, Check, ChevronDown, ChevronLeft, ChevronUp, Copy, Download, FolderPlus, Loader2, Wand2, X } from "lucide-react";
import type { ModelResult, StyleResult } from "@/types";
import { useI18n } from "@/lib/i18n";
import { MODELS, generateWithModel } from "@/lib/imagegen";
import { getKey, hasKey } from "@/lib/settings";
import { getLibraries, createLibrary, addToDefault, addImageToStyle, copyBuiltinToDefault, getDefaultStyles } from "@/lib/userStyles";
import type { UserLibrary } from "@/lib/userStyles";
import { STYLES } from "@/lib/styles";
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
  const [prompt, setPrompt] = useState(style.prompt_zh ?? style.prompt);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [showNewLibInput, setShowNewLibInput] = useState(false);
  const [showStylesList, setShowStylesList] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [aspect, setAspect] = useState("1/1");
  const [libName, setLibName] = useState("");
  const [libraries, setLibraries] = useState<UserLibrary[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLibraries(getLibraries());
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
        setShowNewLibInput(false);
        setShowStylesList(false);
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
    createLibrary(libName.trim(), { ...style, prompt_zh: prompt });
    setSaved(true);
    setPopoverOpen(false);
    setShowNewLibInput(false);
    setLibName("");
    refreshLibs();
  }

  function handleAddToDefault() {
    addToDefault({ ...style, prompt_zh: prompt });
    setSaved(true);
    setPopoverOpen(false);
    refreshLibs();
  }

  async function downloadImage(url: string, filename: string) {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  }

  function handleAddImageToExisting(targetStyleId: string) {
    const imageData = style.image ?? style.images?.[0];
    if (!imageData) return;

    const ok = addImageToStyle(targetStyleId, imageData);
    if (!ok) {
      const builtin = STYLES.find((s) => s.id === targetStyleId);
      if (builtin) {
        copyBuiltinToDefault(builtin, imageData);
      }
    }
    setSaved(true);
    setPopoverOpen(false);
    setShowStylesList(false);
    refreshLibs();
  }

  const ASPECT_SIZES: Record<string, string> = {
    "1/1": "1024x1024",
    "4/5": "1024x1280",
    "9/16": "720x1280",
    "16/9": "1280x720",
    "2.35:1": "1280x544",
  };

  async function runGen() {
    if (!hasKey()) {
      setGenResults(
        Object.fromEntries(
          MODELS.map((m) => [m.id, { modelId: m.id, status: "error", image: "", error: pick("请先在右上角设置中填入硅基流动 API Key。", "Please enter your SiliconFlow API Key in settings first.") } as ModelResult]),
        ),
      );
      return;
    }
    setGenRunning(true);
    setGenResults(
      Object.fromEntries(
        MODELS.map((m) => [m.id, { modelId: m.id, status: "loading", image: "" } as ModelResult]),
      ),
    );
    const imageSize = ASPECT_SIZES[aspect] ?? "1024x1024";
    const genPrompt = style.prompt_zh || style.prompt || prompt;
    await Promise.all(
      MODELS.map(async (m) => {
        const r = await generateWithModel(genPrompt, m.apiModel, imageSize, getKey(), style.negative_prompt);
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

          {/* 主体描述 */}
          {(style.subject_zh || style.subject_en) ? (
            <div className="rounded-lg border border-accent-2 bg-accent-2/10 px-3 py-2">
              <div className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-ink">
                {pick("主体 / 角色", "Subject / Character")}
              </div>
              <p className="text-xs leading-relaxed text-ink">
                {pick(style.subject_zh, style.subject_en)}
              </p>
            </div>
          ) : null}

          {/* 中文描述 */}
          <p className="line-clamp-2 text-sm leading-relaxed text-muted">
            {pick(style.description_zh, style.description_en)}
          </p>

          {/* AI 逐项分析（可展开） */}
          {style.analysis_zh && (
            <div>
              <button
                type="button"
                onClick={() => setAnalysisOpen(!analysisOpen)}
                className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted hover:text-ink transition-colors"
              >
                {analysisOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {pick("AI 分析详情", "AI Analysis Details")}
              </button>
              {analysisOpen && (
                <div className="mt-2 max-h-48 overflow-auto rounded-lg border border-line bg-surface-2 p-3 text-xs leading-relaxed text-muted whitespace-pre-wrap">
                  {style.analysis_zh}
                </div>
              )}
            </div>
          )}

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
              <CopyBtn label="Prompt" content={prompt} />
            </div>
          </div>

          {/* 可编辑 Prompt */}
          <div>
            <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted">
              {pick("编辑提示词", "Edit Prompt")}
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-line bg-surface-2 px-3 py-2 text-xs leading-relaxed text-ink outline-none focus:border-accent transition-colors placeholder:text-muted"
              placeholder={pick("输入提示词…", "Enter prompt…")}
            />
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
              <div className="absolute bottom-full left-0 mb-2 rounded-xl border border-line bg-surface p-1.5 shadow-lg" style={{ width: 260 }}>
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
                ) : showStylesList ? (
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => setShowStylesList(false)}
                      className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-muted transition-colors hover:bg-surface-2"
                    >
                      <ChevronLeft size={14} />
                      {pick("返回", "Back")}
                    </button>
                    <div className="my-0.5 border-t border-line" />
                    <div className="max-h-52 overflow-auto">
                      {[
                        ...STYLES.map((s) => ({ ...s, source: "builtin" as const })),
                        ...getDefaultStyles().map((s) => ({ ...s, source: "default" as const })),
                        ...libraries.flatMap((l) => l.styles.map((s) => ({ ...s, source: l.name }))),
                      ].map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => handleAddImageToExisting(s.id)}
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors hover:bg-surface-2"
                        >
                          <span
                            className="h-5 w-5 shrink-0 rounded"
                            style={{
                              background: `linear-gradient(135deg, ${s.palette[0]?.hex ?? "#ccc"}, ${s.palette[s.palette.length - 1]?.hex ?? "#888"})`,
                            }}
                          />
                          <span className="flex-1 truncate">{pick(s.name_zh, s.name_en)}</span>
                          {s.source !== "builtin" && s.source !== "default" && (
                            <span className="shrink-0 text-[10px] text-muted">{s.source}</span>
                          )}
                        </button>
                      ))}
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
                      onClick={() => {
                        refreshLibs();
                        setShowStylesList(true);
                      }}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors hover:bg-surface-2"
                    >
                      <BookmarkPlus size={14} className="text-muted" />
                      {pick("加入现有风格库", "Add to existing style")}
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
              <div className="flex items-center gap-1">
                {["1/1", "4/5", "9/16", "16/9", "2.35:1"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setAspect(r)}
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
                      aspect === r
                        ? "bg-ink text-bg"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    {r}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={runGen}
                  disabled={genRunning}
                  className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-bg transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-60"
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
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {MODELS.map((m) => {
                const r = genResults[m.id];
                return (
                  <div
                    key={m.id}
                    className="overflow-hidden rounded-lg border border-line bg-surface-2"
                  >
                    <div className="w-full" style={{ aspectRatio: aspect.replace(":", "/") }}>
                      {r?.status === "done" && r.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.image}
                          alt={m.name}
                          className="h-full w-full cursor-pointer object-cover"
                          onClick={() => setZoomedImage(r.image)}
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
                      <span className="flex-1 truncate text-[10px] font-medium">{m.name}</span>
                      {r?.status === "done" && r.image && (
                        <button
                          type="button"
                          onClick={() => downloadImage(r.image, `${m.id}-${Date.now()}.png`)}
                          className="shrink-0 rounded p-0.5 text-muted transition-colors hover:text-ink"
                          title={pick("下载", "Download")}
                        >
                          <Download size={12} />
                        </button>
                      )}
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

      {/* 图片放大 */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-8"
          onClick={() => setZoomedImage(null)}
        >
          <button
            type="button"
            onClick={() => setZoomedImage(null)}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white transition-colors hover:bg-black/60"
          >
            <X size={18} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={zoomedImage}
            alt="preview"
            className="max-h-full max-w-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
