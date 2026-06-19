"use client";

import { useI18n } from "@/components/providers/I18nProvider";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();

  return (
    <div
      className={cn("inline-flex rounded-btn border border-border bg-bg-tertiary p-1", className)}
      role="group"
      aria-label={locale === "tr" ? "Dil seçimi" : "Language selection"}
      data-no-i18n
    >
      <button
        type="button"
        onClick={() => setLocale("tr")}
        className={cn(
          "rounded px-2.5 py-1 text-xs font-semibold transition-colors",
          locale === "tr" ? "bg-accent text-white" : "text-text-secondary hover:text-text-primary",
        )}
        aria-pressed={locale === "tr"}
      >
        TR
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={cn(
          "rounded px-2.5 py-1 text-xs font-semibold transition-colors",
          locale === "en" ? "bg-accent text-white" : "text-text-secondary hover:text-text-primary",
        )}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  );
}
