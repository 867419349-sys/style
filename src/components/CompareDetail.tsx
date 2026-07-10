"use client";

import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getStyleById } from "@/lib/styles";
import { getModelById, mockGeneratedImage, seedFor } from "@/lib/imagegen";

interface Props {
  styleId: string;
  modelId: string;
}

export function CompareDetail({ styleId, modelId }: Props) {
  const { pick } = useI18n();
  const style = getStyleById(styleId);
  const model = getModelById(modelId);

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

  const image = mockGeneratedImage(style, model, seedFor(style.id, model.id));

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
          <div
            className="aspect-square w-full overflow-hidden rounded-3xl border border-line"
            style={{ background: image }}
          />
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
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium transition-colors hover:border-border-strong"
            >
              <Download size={13} />
              {pick("下载", "Download")}
            </button>
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
              "* 该图为原型阶段根据配色合成的占位图。接入真实文生图 API 后，这里会显示该模型用上述提示词实际生成的图片。",
              "* This is a palette-based placeholder for the prototype. Once a real text-to-image API is connected, the actual model output for the prompt above will appear here.",
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
