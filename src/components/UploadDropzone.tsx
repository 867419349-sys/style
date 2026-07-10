"use client";

import { useCallback, useRef, useState } from "react";
import { ImagePlus, Loader2, RefreshCw } from "lucide-react";
import type { StyleResult } from "@/types";
import { useI18n } from "@/lib/i18n";
import { extractStyle } from "@/lib/extract";

interface Props {
  onResult: (style: StyleResult) => void;
}

export function UploadDropzone({ onResult }: Props) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      setPreview(url);
      setLoading(true);
      try {
        const result = await extractStyle({
          fileName: file.name,
          fileSize: file.size,
        });
        onResult(result);
      } finally {
        setLoading(false);
      }
    },
    [onResult],
  );

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
        className={`relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed text-center transition-colors ${
          dragOver ? "border-accent bg-accent-2/20" : "border-line bg-surface hover:border-border-strong"
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

        <div className="relative z-10 flex flex-col items-center gap-2 px-4">
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
      </div>
    </div>
  );
}
