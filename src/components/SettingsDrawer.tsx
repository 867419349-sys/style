"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { MODELS } from "@/lib/imagegen";
import { loadKeys, saveKeys, type ApiKeys } from "@/lib/settings";

interface Props {
  onClose: () => void;
}

export function SettingsDrawer({ onClose }: Props) {
  const { t, pick } = useI18n();
  const [keys, setKeys] = useState<ApiKeys>(() => loadKeys());
  const [saved, setSaved] = useState(false);

  function update(next: ApiKeys) {
    setKeys(next);
    setSaved(false);
  }

  function handleSave() {
    saveKeys(keys);
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
            <span className="mt-0.5 shrink-0 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-bg">
              {t("mockBadge")}
            </span>
            <span>{t("settingsNote")}</span>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">{t("visionKey")}</span>
            <input
              type="password"
              value={keys.vision}
              onChange={(e) => update({ ...keys, vision: e.target.value })}
              placeholder="sk-..."
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm font-mono outline-none focus:border-border-strong"
            />
          </label>

          <div className="space-y-3">
            <div className="text-xs font-medium uppercase tracking-wide text-muted">
              {pick("文生图模型 Key", "Text-to-image keys")}
            </div>
            {MODELS.map((m) => (
              <label key={m.id} className="block">
                <span className="mb-1.5 flex items-center gap-2 text-sm font-medium">
                  <span
                    className="h-4 w-4 rounded"
                    style={{
                      background: `linear-gradient(135deg, ${m.swatch[0]}, ${m.swatch[1]})`,
                    }}
                  />
                  {m.name}
                </span>
                <input
                  type="password"
                  value={keys.models[m.id] ?? ""}
                  onChange={(e) =>
                    update({
                      ...keys,
                      models: { ...keys.models, [m.id]: e.target.value },
                    })
                  }
                  placeholder="sk-..."
                  className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm font-mono outline-none focus:border-border-strong"
                />
              </label>
            ))}
          </div>
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
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg"
          >
            {saved ? t("copied") : t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
