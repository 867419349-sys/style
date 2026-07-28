"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { StyleResult } from "@/types";
import { getStyleById } from "@/lib/styles";
import { getAllUserStyles, findStyleLibrary, updateStyle, EVENT } from "@/lib/userStyles";
import { useI18n } from "@/lib/i18n";
import { StyleDetail } from "./StyleDetail";
import { Check, Pencil, X } from "lucide-react";

export function StylePageView({ id }: { id: string }) {
  const { pick } = useI18n();
  const [style, setStyle] = useState<StyleResult | null>(() => {
    return getStyleById(id) ?? null;
  });
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<StyleResult | null>(null);

  const isBuiltin = getStyleById(id) !== undefined;

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

  function startEditing() {
    if (!style) return;
    setEditData({ ...style });
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
    setEditData(null);
  }

  function saveEditing() {
    if (!editData) return;
    const libId = findStyleLibrary(id);
    if (!libId) return;
    updateStyle(libId, id, {
      name_zh: editData.name_zh,
      name_en: editData.name_en,
      tagline_zh: editData.tagline_zh,
      tagline_en: editData.tagline_en,
      description_zh: editData.description_zh,
      description_en: editData.description_en,
      prompt: editData.prompt,
    });
    setStyle(editData);
    setEditing(false);
    setEditData(null);
  }

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

  const current = editing && editData ? editData : style;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex items-center justify-between">
        <Link
          href="/#gallery"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          <X size={15} className="rotate-45" />
          {pick("返回", "Back")}
        </Link>

        {!isBuiltin && !editing && (
          <button
            type="button"
            onClick={startEditing}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium transition-colors hover:border-border-strong"
          >
            <Pencil size={13} />
            {pick("编辑", "Edit")}
          </button>
        )}

        {editing && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={saveEditing}
              className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-bg"
            >
              <Check size={13} />
              {pick("保存", "Save")}
            </button>
            <button
              type="button"
              onClick={cancelEditing}
              className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted"
            >
              <X size={13} />
              {pick("取消", "Cancel")}
            </button>
          </div>
        )}
      </div>

      {editing && editData ? (
        <div className="mt-6 space-y-4 rounded-2xl border border-line bg-surface p-6">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-muted">{pick("中文名称", "Name (ZH)")}</span>
              <input
                type="text"
                value={editData.name_zh}
                onChange={(e) => setEditData({ ...editData, name_zh: e.target.value })}
                className="rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-muted">{pick("英文名称", "Name (EN)")}</span>
              <input
                type="text"
                value={editData.name_en}
                onChange={(e) => setEditData({ ...editData, name_en: e.target.value })}
                className="rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-muted">{pick("中文标语", "Tagline (ZH)")}</span>
              <input
                type="text"
                value={editData.tagline_zh}
                onChange={(e) => setEditData({ ...editData, tagline_zh: e.target.value })}
                className="rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-muted">{pick("英文标语", "Tagline (EN)")}</span>
              <input
                type="text"
                value={editData.tagline_en}
                onChange={(e) => setEditData({ ...editData, tagline_en: e.target.value })}
                className="rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted">{pick("中文描述", "Description (ZH)")}</span>
            <textarea
              rows={2}
              value={editData.description_zh}
              onChange={(e) => setEditData({ ...editData, description_zh: e.target.value })}
              className="rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent resize-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted">Prompt</span>
            <textarea
              rows={3}
              value={editData.prompt}
              onChange={(e) => setEditData({ ...editData, prompt: e.target.value })}
              className="rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent resize-none"
            />
          </label>
        </div>
      ) : (
        <StyleDetail style={current} />
      )}
    </div>
  );
}
