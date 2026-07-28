"use client";

import { useState } from "react";
import { X, Key, Eye, EyeOff, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getKey, saveKey } from "@/lib/settings";

interface Props {
  onClose: () => void;
}

export function SettingsDrawer({ onClose }: Props) {
  const { t } = useI18n();
  const [key, setKey] = useState(() => getKey());
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);

  function handleSave() {
    saveKey(key);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-bg shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-xl">{t("settingsTitle")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        <div className="scroll-slim flex-1 space-y-5 overflow-auto px-5 py-5">
          <div className="flex items-start gap-2 rounded-xl border border-accent-2 bg-accent-2/25 px-3 py-2.5 text-xs leading-relaxed text-ink">
            <Key size={14} className="mt-0.5 shrink-0 text-accent" />
            <span>{t("settingsNote")}</span>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">{t("visionKey")}</span>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={key}
                onChange={(e) => { setKey(e.target.value); setSaved(false); }}
                placeholder="sk-..."
                autoFocus
                className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 pr-10 text-sm font-mono outline-none focus:border-border-strong"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted transition-colors hover:text-ink"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
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
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-border-strong"
          >
            {t("close")}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!key.trim()}
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg disabled:opacity-40"
          >
            {saved ? t("copied") : t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
