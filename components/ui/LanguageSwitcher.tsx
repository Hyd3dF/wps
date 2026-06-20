"use client";

import { useI18n } from "@/components/providers/I18nProvider";
import { cn } from "@/lib/utils";
import { localeOptions, type Locale } from "@/lib/i18n-shared";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();
  const selected = localeOptions.find((option) => option.code === locale);

  return (
    <label className={cn("inline-flex items-center gap-2 rounded-btn border border-border bg-bg-tertiary px-3 py-2 text-xs font-semibold text-text-secondary", className)} data-no-i18n>
      <span>{locale === "tr" ? "Dil" : "Language"}</span>
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        className="max-w-[11rem] rounded border border-border bg-bg-secondary px-2 py-1 text-text-primary outline-none transition-colors focus:border-accent"
        aria-label={locale === "tr" ? "Dil seçimi" : "Language selection"}
      >
        {localeOptions.map((option) => (
          <option key={option.code} value={option.code}>
            {option.nativeName} ({option.code.toUpperCase()})
          </option>
        ))}
      </select>
      <span className="hidden text-text-tertiary sm:inline">{selected?.label}</span>
    </label>
  );
}
