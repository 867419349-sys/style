"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { STYLES } from "@/lib/styles";
import { getLibraries, getDefaultStyles, EVENT } from "@/lib/userStyles";
import type { UserLibrary } from "@/lib/userStyles";
import type { StyleResult } from "@/types";
import { StyleCard } from "./StyleCard";

function useUserData() {
  const [libs, setLibs] = useState<UserLibrary[]>(() => {
    if (typeof window === "undefined") return [];
    return getLibraries();
  });
  const [defaultStyles, setDefaultStyles] = useState<StyleResult[]>(() => {
    if (typeof window === "undefined") return [];
    return getDefaultStyles();
  });

  useEffect(() => {
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

  const mainGallery = [...defaultStyles, ...STYLES];

  return (
    <section id="gallery" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
      <div className="mb-8">
        <h2 className="font-display text-3xl sm:text-4xl">{t("galleryTitle")}</h2>
        <p className="mt-2 max-w-xl text-sm text-muted">{t("gallerySub")}</p>
      </div>

      {libraries.map((lib) => (
        <div key={lib.id} className="mb-10">
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted">
            {lib.name}
            <span className="ml-2 font-normal normal-case text-[11px]">
              {lib.styles.length} {pick("个风格", " styles")}
            </span>
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {lib.styles.map((style) => (
              <StyleCard key={style.id} style={style} />
            ))}
          </div>
        </div>
      ))}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {mainGallery.map((style) => (
          <StyleCard key={style.id} style={style} />
        ))}
      </div>
    </section>
  );
}
