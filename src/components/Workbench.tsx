"use client";

import { useEffect, useState } from "react";
import { Key, Eye, EyeOff, ExternalLink } from "lucide-react";
import type { StyleResult } from "@/types";
import { useI18n } from "@/lib/i18n";
import { getKey, saveKey } from "@/lib/settings";
import { StyleGallery } from "./StyleGallery";
import { UploadDropzone } from "./UploadDropzone";
import { ExtractModal } from "./ExtractModal";

export function Workbench() {
  const { t, pick } = useI18n();
  const [result, setResult] = useState<StyleResult | null>(null);
  const [key, setKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setKey(getKey());
  }, []);

  function handleResult(style: StyleResult) {
    try {
      sessionStorage.setItem("zomo:last-extract", JSON.stringify(style));
    } catch {
      // sessionStorage 不可用时忽略
    }
    setResult(style);
  }

  function handleSaveKey() {
    saveKey(key);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }

  return (
    <>
      <StyleGallery />

      <section
        id="studio"
        className="scroll-mt-20 border-y border-line bg-surface-2/40"
      >
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-8">
            <h2 className="font-display text-3xl sm:text-4xl">{t("studioTitle")}</h2>
            <p className="mt-2 max-w-xl text-sm text-muted">{t("studioSub")}</p>
          </div>

          {/* API Key 设置区 */}
          <div className="mb-8 rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-start gap-3">
              <Key size={18} className="mt-0.5 shrink-0 text-accent" />
              <div className="flex-1">
                <div className="mb-2 text-sm font-medium">{t("visionKey")}</div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <input
                      type={showKey ? "text" : "password"}
                      value={key}
                      onChange={(e) => { setKey(e.target.value); setSaved(false); }}
                      placeholder="sk-..."
                      className="w-full rounded-xl border border-line bg-surface-2 px-3 py-2 pr-10 text-sm font-mono outline-none focus:border-border-strong"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted transition-colors hover:text-ink"
                    >
                      {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveKey}
                    disabled={!key.trim()}
                    className="shrink-0 rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg disabled:opacity-40"
                  >
                    {saved ? t("copied") : t("save")}
                  </button>
                </div>
                <a
                  href="https://cloud.siliconflow.cn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-accent"
                >
                  <ExternalLink size={12} />
                  {t("keyHint")}
                </a>
              </div>
            </div>
          </div>

          <div className="grid items-center gap-8 lg:grid-cols-2">
            <UploadDropzone onResult={handleResult} />
            <ul className="space-y-4 text-sm text-muted">
              {[
                pick("① 拖入或选择一张界面 / 插画图片", "① Drop or pick a UI / illustration image"),
                pick("② 自动分析并生成风格提示词与配色", "② Auto-analyze into a style prompt + palette"),
                pick("③ 弹窗展示结果，可复制 Markdown / CSS / Prompt", "③ Modal shows result — copy Markdown / CSS / Prompt"),
                pick("④ 一键用多个文生图模型对比效果", "④ Compare across text-to-image models in one click"),
              ].map((line, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-display text-lg text-ink">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {result && (
        <ExtractModal style={result} onClose={() => setResult(null)} />
      )}
    </>
  );
}
