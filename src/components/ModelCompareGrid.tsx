"use client";

import { useCallback, useState } from "react";
import { RefreshCw, Wand2 } from "lucide-react";
import type { ModelResult, StyleResult } from "@/types";
import { useI18n } from "@/lib/i18n";
import { MODELS, generateWithModel } from "@/lib/imagegen";
import { getKey, hasKey } from "@/lib/settings";
import { ModelCard } from "./ModelCard";

export function ModelCompareGrid({ style }: { style: StyleResult | null }) {
  const { t, pick } = useI18n();
  const [results, setResults] = useState<Record<string, ModelResult>>({});
  const [running, setRunning] = useState(false);
  const [trackedId, setTrackedId] = useState<string | undefined>(style?.id);

  // reset outputs when the style changes (render-time reset, not an effect)
  if (style?.id !== trackedId) {
    setTrackedId(style?.id);
    setResults({});
    setRunning(false);
  }

  const runAll = useCallback(async () => {
    if (!style) return;
    if (!hasKey()) {
      setResults(
        Object.fromEntries(
          MODELS.map((m) => [
            m.id,
            { modelId: m.id, status: "error", image: "", error: pick("请先在右上角设置中填入硅基流动 API Key。", "Please enter your SiliconFlow API Key in settings first.") } as ModelResult,
          ]),
        ),
      );
      return;
    }
    setRunning(true);
    // mark all loading
    setResults(
      Object.fromEntries(
        MODELS.map((m) => [
          m.id,
          { modelId: m.id, status: "loading", image: "" } as ModelResult,
        ]),
      ),
    );
    await Promise.all(
      MODELS.map(async (m) => {
        const genPrompt = style.prompt_zh || style.prompt;
        const r = await generateWithModel(genPrompt, m.apiModel, undefined, getKey(), style.negative_prompt);
        setResults((prev) => ({
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
    setRunning(false);
  }, [style]);

  return (
    <section id="compare" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl">{t("compareTitle")}</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">{t("compareSub")}</p>
        </div>
        {style && (
          <button
            type="button"
            onClick={runAll}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-bg transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-60"
          >
            {Object.keys(results).length ? (
              <RefreshCw size={15} className={running ? "animate-spin" : ""} />
            ) : (
              <Wand2 size={15} />
            )}
            {running
              ? t("generating")
              : Object.keys(results).length
                ? t("regenerate")
                : t("generate")}
          </button>
        )}
      </div>

      {!style ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface/50 p-10 text-center text-sm text-muted">
          {t("compareEmpty")}
        </div>
      ) : (
        <>
          <div className="mb-4 rounded-xl border border-line bg-surface px-4 py-3 text-xs text-muted">
            <span className="font-medium text-ink">Prompt · </span>
            {style.prompt_zh || style.prompt}
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {MODELS.map((m) => (
              <ModelCard
                key={m.id}
                model={m}
                result={results[m.id]}
                href={`/compare/${style.id}/${m.id}`}
              />
            ))}
          </div>
          <p className="mt-4 text-[11px] text-muted">
            {pick(
              "* 由硅基流动（SiliconFlow）多模型真实生成；图片为临时链接，约 24 小时后过期，需要时请及时下载。",
              "* Generated live via SiliconFlow multi-model API. Image links are temporary and expire in ~24h — download promptly if needed.",
            )}
          </p>
        </>
      )}
    </section>
  );
}
