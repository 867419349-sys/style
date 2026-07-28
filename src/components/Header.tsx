"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "./LanguageToggle";

export const BRAND = "Zomo Design";

export function Header() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-xl leading-none">{BRAND}</span>
          <span className="hidden text-xs text-muted sm:inline">{t("brandTag")}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <Link href="/#gallery" className="transition-colors hover:text-ink">
            {t("navGallery")}
          </Link>
          <Link href="/#studio" className="transition-colors hover:text-ink">
            {t("navStudio")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
