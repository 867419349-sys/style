"use client";

import { useCallback, useState } from "react";
import { ImagePlus, Loader2, RefreshCw } from "lucide-react";
import type { StyleResult } from "@/types";
import { useI18n } from "@/lib/i18n";
import { extractStyle } from "@/lib/extract";

interface Props {
  onResult: (style: StyleResult) => void;
}

export function UploadDropzone({ onResult }: Props) {
  const { t, pick } = useI18n();
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      setPreview(url);
      setError(null);
      setLoading(true);
      try {
        const result = await extractStyle(file);
        onResult(result);
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : pick("分析失败，请重试。", "Analysis failed, please retry."),
        );
      } finally {
        setLoading(false);
      }
    },
    [onResult, pick],
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={() => setDragOver(false)}
        className={`relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed text-center transition-colors ${
          dragOver
            ? "border-accent bg-accent-2/20"
            : "border-line bg-surface hover:border-border-strong"
        }`}
      >
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="preview"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {preview && <div className="absolute inset-0 bg-ink/45" />}

        <div className="pointer-events-none relative z-10 flex flex-col items-center gap-2 px-4">
          {loading ? (
            <>
              <Loader2 size={28} className="animate-spin text-bg" />
              <div className="text-sm font-medium text-bg">{t("analyzing")}</div>
            </>
          ) : preview ? (
            <>
              <RefreshCw size={24} className="text-bg" />
              <div className="text-sm font-medium text-bg">{t("reExtract")}</div>
            </>
          ) : (
            <>
              <ImagePlus size={28} className="text-muted" />
              <div className="text-sm font-medium">{t("dropHint")}</div>
              <div className="text-xs text-muted">{t("dropSub")}</div>
            </>
          )}
        </div>

        {/* 透明覆盖的原生 file input：点击/拖拽都由它接收，浏览器原生弹窗，最稳可靠 */}
        <input
          type="file"
          accept="image/*"
          disabled={loading}
          aria-label={pick("上传图片", "Upload image")}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
          className="absolute inset-0 z-20 cursor-pointer opacity-0 disabled:cursor-default"
        />
      </div>
      {error && <p className="mt-2 text-xs text-accent-ink">{error}</p>}
    </div>
  );
}
