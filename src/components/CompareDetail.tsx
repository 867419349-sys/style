"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Download, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getStyleById } from "@/lib/styles";
import { getModelById, generateWithModel } from "@/lib/imagegen";

interface Props {
  styleId: string;
  modelId: string;
}

type GenState =
  | { status: "loading" }
  | { status: "done"; url: string }
  | { status: "error"; error?: string };

export function CompareDetail({ styleId, modelId }: Props) {
  const { pick } = useI18n();
  const style = getStyleById(styleId);
  const model = getModelById(modelId);
  const [state, setState] = useState<GenState>({ status: "loading" });

  const prompt = style?.prompt;
  const apiModel = model?.apiModel;
  useEffect(() => {
    if (!prompt || !apiModel) return;
    let alive = true;
    generateWithModel(prompt, apiModel).then((r) => {
      if (!alive) return;
      setState(
        r.url ? { status: "done", url: r.url } : { status: "error", error: r.error },
      );
    });
    return () => {
      alive = false;
    };
  }, [prompt, apiModel]);

  if (!style || !model) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center text-muted">
        {pick("找不到该对比结果。", "This comparison was not found.")}
        <div className="mt-4">
          <Link href="/" className="text-accent-ink underline">
            {pick("返回首页", "Back home")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link
        href={`/style/${style.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft size={15} />
        {pick("返回风格详情", "Back to style")}
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-line bg-surface-2">
            {state.status === "done" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={state.url}
                alt={model.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : state.status === "error" ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
                <AlertCircle size={28} className="text-accent-ink" />
                <span className="text-sm text-muted">
                  {state.error ?? pick("生成失败", "Generation failed")}
                </span>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <Loader2 size={30} className="animate-spin text-muted" />
                <span className="text-xs text-muted">
                  {pick("正在生成…", "Generating…")}
                </span>
              </div>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="h-8 w-8 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${model.swatch[0]}, ${model.swatch[1]})`,
                }}
              />
              <div>
                <div className="font-medium">{model.name}</div>
                <div className="text-xs text-muted">
                  {pick(model.vendor_zh, model.vendor_en)}
                </div>
              </div>
            </div>
            <a
              href={state.status === "done" ? state.url : undefined}
              target="_blank"
              rel="noreferrer"
              aria-disabled={state.status !== "done"}
              className={`inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium transition-colors ${
                state.status === "done"
                  ? "hover:border-border-strong"
                  : "pointer-events-none opacity-40"
              }`}
            >
              <Download size={13} />
              {pick("下载", "Download")}
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted">
              {pick("参考风格", "Reference style")}
            </div>
            <Link
              href={`/style/${style.id}`}
              className="mt-2 flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 transition-colors hover:border-border-strong"
            >
              <span
                className="h-14 w-14 shrink-0 rounded-xl"
                style={{ background: style.thumb }}
              />
              <span>
                <span className="block font-display text-lg">
                  {pick(style.name_zh, style.name_en)}
                </span>
                <span className="block text-xs text-muted">
                  {pick(style.tagline_zh, style.tagline_en)}
                </span>
              </span>
            </Link>
          </div>

          <div>
            <div className="mb-2 text-xs uppercase tracking-wide text-muted">
              {pick("使用的提示词", "Prompt used")}
            </div>
            <div className="rounded-2xl border border-line bg-surface p-4 text-sm leading-relaxed">
              {style.prompt}
            </div>
          </div>

          <div className="rounded-2xl border border-accent-2 bg-accent-2/25 px-4 py-3 text-xs leading-relaxed text-ink">
            {pick(
              "* 该图由硅基流动（SiliconFlow）用上述提示词实时生成。图片为临时链接，约 24 小时后过期，请及时下载保存。",
              "* Generated live by SiliconFlow using the prompt above. The image link is temporary and expires in ~24h — download it promptly.",
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
