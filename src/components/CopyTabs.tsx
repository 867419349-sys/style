"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import type { StyleResult } from "@/types";
import { useI18n } from "@/lib/i18n";

type TabId = "desc" | "markdown" | "css" | "prompt";

export function CopyTabs({ style }: { style: StyleResult }) {
  const { t, pick } = useI18n();
  const [tab, setTab] = useState<TabId>("desc");
  const [copied, setCopied] = useState(false);

  const tabs = useMemo(
    () =>
      [
        { id: "desc" as const, label: t("tabDesc") },
        { id: "markdown" as const, label: "Markdown" },
        { id: "css" as const, label: "CSS" },
        { id: "prompt" as const, label: t("tabPrompt") },
      ],
    [t],
  );

  const content: Record<TabId, string> = {
    desc: pick(style.description_zh, style.description_en),
    markdown: style.markdown,
    css: style.css,
    prompt: style.prompt,
  };

  const isMono = tab === "markdown" || tab === "css";
  const current = content[tab];

  async function copy() {
    try {
      await navigator.clipboard.writeText(current);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be unavailable */
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-surface">
      <div className="flex items-center justify-between gap-2 border-b border-line px-2 py-2">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              type="button"
              onClick={() => {
                setTab(tb.id);
                setCopied(false);
              }}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === tb.id
                  ? "bg-ink text-bg"
                  : "text-muted hover:bg-surface-2 hover:text-ink"
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium transition-colors hover:border-border-strong"
        >
          {copied ? (
            <>
              <Check size={13} className="text-accent-ink" /> {t("copied")}
            </>
          ) : (
            <>
              <Copy size={13} /> {t("copy")}
            </>
          )}
        </button>
      </div>
      <div className="scroll-slim max-h-72 overflow-auto p-4">
        <pre
          className={`whitespace-pre-wrap break-words text-sm leading-relaxed ${
            isMono ? "font-mono text-[13px]" : ""
          }`}
        >
          {current}
        </pre>
      </div>
    </div>
  );
}
