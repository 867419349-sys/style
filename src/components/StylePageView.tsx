"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { StyleResult } from "@/types";
import { getStyleById } from "@/lib/styles";
import { getAllUserStyles, EVENT } from "@/lib/userStyles";
import { useI18n } from "@/lib/i18n";
import { StyleDetail } from "./StyleDetail";

export function StylePageView({ id }: { id: string }) {
  const { pick } = useI18n();
  const [style, setStyle] = useState<StyleResult | null>(() => {
    const builtin = getStyleById(id);
    if (builtin) return builtin;
    if (typeof window === "undefined") return null;
    return getAllUserStyles().find((s) => s.id === id) ?? null;
  });

  useEffect(() => {
    if (style) return;
    const check = () => {
      const s = getStyleById(id) ?? getAllUserStyles().find((s) => s.id === id) ?? null;
      if (s) setStyle(s);
    };
    check();
    window.addEventListener(EVENT, check);
    return () => window.removeEventListener(EVENT, check);
  }, [id, style]);

  if (!style) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="font-display text-3xl">
          {pick("风格未找到", "Style not found")}
        </h1>
        <p className="mt-3 text-muted">
          {pick("该风格可能已被移除。", "This style may have been removed.")}
        </p>
        <Link
          href="/#gallery"
          className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-medium text-bg"
        >
          {pick("返回风格库", "Back to gallery")}
        </Link>
      </div>
    );
  }

  return <StyleDetail style={style} />;
}
