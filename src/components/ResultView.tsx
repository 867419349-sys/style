"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import type { StyleResult } from "@/types";
import { getStyleById } from "@/lib/styles";
import { useI18n } from "@/lib/i18n";
import { StyleDetail } from "./StyleDetail";

const emptySubscribe = () => () => {};

function readStored(): string | null {
  try {
    return sessionStorage.getItem("zomo:last-extract");
  } catch {
    return null;
  }
}

/**
 * 结果页视图：内置风格直接按 id 命中；上传提取的动态风格从 sessionStorage 读取
 * （动态结果不在内置 STYLES 里，无法用 getStyleById 查到）。用 useSyncExternalStore
 * 读取外部存储，避免在 effect 里 setState 及 SSR 水合不一致。
 */
export function ResultView({ id }: { id?: string }) {
  const { pick } = useI18n();
  const raw = useSyncExternalStore(emptySubscribe, readStored, () => null);

  const style = useMemo<StyleResult | null>(() => {
    if (id) {
      const builtin = getStyleById(id);
      if (builtin) return builtin;
    }
    if (raw) {
      try {
        const s = JSON.parse(raw) as StyleResult;
        if (!id || s.id === id) return s;
      } catch {
        // 解析失败视为无结果
      }
    }
    return null;
  }, [id, raw]);

  if (!style) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="font-display text-3xl">
          {pick("还没有提取结果", "No result yet")}
        </h1>
        <p className="mt-3 text-muted">
          {pick(
            "请先上传一张图片来提取设计风格。",
            "Upload an image to extract a style first.",
          )}
        </p>
        <Link
          href="/#studio"
          className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-medium text-bg"
        >
          {pick("去上传图片", "Go upload")}
        </Link>
      </div>
    );
  }

  return <StyleDetail style={style} fromUpload />;
}
