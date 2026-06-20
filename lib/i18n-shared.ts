import tr from "@/messages/tr.json";
import en from "@/messages/en.json";

export type Locale = "tr" | "en";

export const LOCALE_COOKIE = "oroya_locale";
export const dictionaries = {
  tr,
  en,
} as const;

export const locales = Object.keys(dictionaries) as Locale[];

export const localeOptions: { code: Locale; label: string; nativeName: string; dir?: "rtl" | "ltr" }[] = [
  { code: "tr", label: "Türkçe", nativeName: "Türkçe" },
  { code: "en", label: "English", nativeName: "English" },
];

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export type LegalKind = "terms" | "privacy" | "refund";

export interface LegalContent {
  title: string;
  updatedAt: string;
  description: string;
  sections: [string, string][];
}

function pick(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, name) => String(vars[name] ?? ""));
}

export function translate(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const primary = pick(dictionaries[locale] as unknown as Record<string, unknown>, key);
  if (typeof primary === "string") return vars ? interpolate(primary, vars) : primary;
  const fallback = pick(dictionaries.en as unknown as Record<string, unknown>, key);
  if (typeof fallback === "string") return vars ? interpolate(fallback, vars) : fallback;
  return key;
}

export function getLegalContent(locale: Locale, kind: LegalKind): LegalContent | null {
  const dict = dictionaries[locale] as unknown as { legal?: Record<string, LegalContent> };
  const content = dict?.legal?.[kind];
  if (content) return content;
  if (locale !== "tr") {
    const fallback = dictionaries.en as unknown as { legal?: Record<string, LegalContent> };
    return fallback?.legal?.[kind] ?? null;
  }
  return null;
}
