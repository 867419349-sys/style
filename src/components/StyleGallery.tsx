"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { STYLES } from "@/lib/styles";
import { getLibraries, getDefaultStyles, deleteLibrary, removeUserStyle, renameLibrary, EVENT } from "@/lib/userStyles";
import type { UserLibrary } from "@/lib/userStyles";
import type { StyleResult } from "@/types";
import { StyleCard } from "./StyleCard";
import { Check, Pencil, Trash2, X } from "lucide-react";

function useUserData() {
  const [libs, setLibs] = useState<UserLibrary[]>([]);
  const [defaultStyles, setDefaultStyles] = useState<StyleResult[]>([]);

  useEffect(() => {
    setLibs(getLibraries());
    setDefaultStyles(getDefaultStyles());

    function onChange() {
      setLibs(getLibraries());
      setDefaultStyles(getDefaultStyles());
    }
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);

  return { libraries: libs, defaultStyles };
}

export function StyleGallery() {
  const { t, pick } = useI18n();
  const { libraries, defaultStyles } = useUserData();
  const [editingLibId, setEditingLibId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const mainGallery = [...defaultStyles, ...STYLES];

  function handleDeleteLib(libId: string) {
    if (confirm(pick("确定删除这个风格库？", "Delete this library?"))) {
      deleteLibrary(libId);
    }
  }

  function handleDeleteStyle(libId: string, styleId: string) {
    if (confirm(pick("确定删除这个风格？", "Delete this style?"))) {
      removeUserStyle(libId, styleId);
    }
  }

  function startRename(libId: string, currentName: string) {
    setEditingLibId(libId);
    setEditName(currentName);
  }

  function confirmRename() {
    if (editingLibId && editName.trim()) {
      renameLibrary(editingLibId, editName.trim());
    }
    setEditingLibId(null);
    setEditName("");
  }

  return (
    <section id="gallery" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
      <div className="mb-8">
        <h2 className="font-display text-3xl sm:text-4xl">{t("galleryTitle")}</h2>
        <p className="mt-2 max-w-xl text-sm text-muted">{t("gallerySub")}</p>
      </div>

      {libraries.map((lib) => (
        <div key={lib.id} className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            {editingLibId === lib.id ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="rounded border border-line bg-surface px-2 py-0.5 text-sm font-medium text-ink outline-none focus:border-accent"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") confirmRename();
                    if (e.key === "Escape") { setEditingLibId(null); setEditName(""); }
                  }}
                />
                <button onClick={confirmRename} className="rounded p-0.5 text-accent-ink hover:bg-surface-2">
                  <Check size={14} />
                </button>
                <button onClick={() => { setEditingLibId(null); setEditName(""); }} className="rounded p-0.5 text-muted hover:bg-surface-2">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-sm font-medium uppercase tracking-wide text-muted">
                  {lib.name}
                  <span className="ml-2 font-normal normal-case text-[11px]">
                    {lib.styles.length} {pick("个风格", " styles")}
                  </span>
                </h3>
                <button
                  onClick={() => startRename(lib.id, lib.name)}
                  className="rounded p-0.5 text-muted transition-colors hover:text-ink"
                  title={pick("重命名", "Rename")}
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => handleDeleteLib(lib.id)}
                  className="rounded p-0.5 text-muted transition-colors hover:text-red-500"
                  title={pick("删除", "Delete")}
                >
                  <Trash2 size={12} />
                </button>
              </>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {lib.styles.map((style) => (
              <StyleCard
                key={style.id}
                style={style}
                onDelete={() => handleDeleteStyle(lib.id, style.id)}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {mainGallery.map((style) => {
          const isUserStyle = defaultStyles.some((s) => s.id === style.id);
          return (
            <StyleCard
              key={style.id}
              style={style}
              onDelete={isUserStyle ? () => handleDeleteStyle("default", style.id) : undefined}
            />
          );
        })}
      </div>
    </section>
  );
}
