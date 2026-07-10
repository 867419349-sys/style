"use client";

import { useI18n } from "@/lib/i18n";
import { STYLES } from "@/lib/styles";
import { StyleCard } from "./StyleCard";

export function StyleGallery() {
  const { t } = useI18n();
  return (
    <section id="gallery" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
      <div className="mb-8">
        <h2 className="font-display text-3xl sm:text-4xl">{t("galleryTitle")}</h2>
        <p className="mt-2 max-w-xl text-sm text-muted">{t("gallerySub")}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {STYLES.map((style) => (
          <StyleCard key={style.id} style={style} />
        ))}
      </div>
    </section>
  );
}
