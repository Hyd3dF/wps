import ar from "@/messages/ar.json";
import cs from "@/messages/cs.json";
import da from "@/messages/da.json";
import de from "@/messages/de.json";
import el from "@/messages/el.json";
import en from "@/messages/en.json";
import es from "@/messages/es.json";
import fa from "@/messages/fa.json";
import fi from "@/messages/fi.json";
import fr from "@/messages/fr.json";
import he from "@/messages/he.json";
import hi from "@/messages/hi.json";
import id from "@/messages/id.json";
import it from "@/messages/it.json";
import ja from "@/messages/ja.json";
import ko from "@/messages/ko.json";
import ms from "@/messages/ms.json";
import nl from "@/messages/nl.json";
import no from "@/messages/no.json";
import pl from "@/messages/pl.json";
import pt from "@/messages/pt.json";
import ro from "@/messages/ro.json";
import ru from "@/messages/ru.json";
import sv from "@/messages/sv.json";
import th from "@/messages/th.json";
import tr from "@/messages/tr.json";
import uk from "@/messages/uk.json";
import ur from "@/messages/ur.json";
import vi from "@/messages/vi.json";
import zh from "@/messages/zh.json";

export type Locale = "ar" | "cs" | "da" | "de" | "el" | "en" | "es" | "fa" | "fi" | "fr" | "he" | "hi" | "id" | "it" | "ja" | "ko" | "ms" | "nl" | "no" | "pl" | "pt" | "ro" | "ru" | "sv" | "th" | "tr" | "uk" | "ur" | "vi" | "zh";

export const LOCALE_COOKIE = "oroya_locale";
export const dictionaries = {
  ar, cs, da, de, el, en, es, fa, fi, fr, he, hi, id, it, ja, ko, ms, nl, no, pl, pt, ro, ru, sv, th, tr, uk, ur, vi, zh
} as const;

export const locales = Object.keys(dictionaries) as Locale[];

export const localeOptions: { code: Locale; label: string; nativeName: string; dir?: "rtl" | "ltr" }[] = [
  { code: "en", label: "English", nativeName: "English" },
  { code: "tr", label: "Turkish", nativeName: "Türkçe" },
  { code: "ar", label: "Arabic", nativeName: "العربية", dir: "rtl" },
  { code: "zh", label: "Chinese", nativeName: "中文" },
  { code: "es", label: "Spanish", nativeName: "Español" },
  { code: "fr", label: "French", nativeName: "Français" },
  { code: "de", label: "German", nativeName: "Deutsch" },
  { code: "ru", label: "Russian", nativeName: "Русский" },
  { code: "hi", label: "Hindi", nativeName: "हिन्दी" },
  { code: "pt", label: "Portuguese", nativeName: "Português" },
  { code: "ja", label: "Japanese", nativeName: "日本語" },
  { code: "ko", label: "Korean", nativeName: "한국어" },
  { code: "it", label: "Italian", nativeName: "Italiano" },
  { code: "nl", label: "Dutch", nativeName: "Nederlands" },
  { code: "pl", label: "Polish", nativeName: "Polski" },
  { code: "uk", label: "Ukrainian", nativeName: "Українська" },
  { code: "vi", label: "Vietnamese", nativeName: "Tiếng Việt" },
  { code: "th", label: "Thai", nativeName: "ไทย" },
  { code: "ur", label: "Urdu", nativeName: "اردو", dir: "rtl" },
  { code: "fa", label: "Persian", nativeName: "فارسی", dir: "rtl" },
  { code: "he", label: "Hebrew", nativeName: "עברית", dir: "rtl" },
  { code: "id", label: "Indonesian", nativeName: "Bahasa Indonesia" },
  { code: "ms", label: "Malay", nativeName: "Bahasa Melayu" },
  { code: "ro", label: "Romanian", nativeName: "Română" },
  { code: "el", label: "Greek", nativeName: "Ελληνικά" },
  { code: "cs", label: "Czech", nativeName: "Čeština" },
  { code: "da", label: "Danish", nativeName: "Dansk" },
  { code: "fi", label: "Finnish", nativeName: "Suomi" },
  { code: "no", label: "Norwegian", nativeName: "Norsk" },
  { code: "sv", label: "Swedish", nativeName: "Svenska" }
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
