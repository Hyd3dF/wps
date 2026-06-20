import "server-only";
import { cookies } from "next/headers";
import {
  getLegalContent,
  translate,
  type LegalContent,
  type LegalKind,
  type Locale,
  LOCALE_COOKIE,
  isLocale,
} from "@/lib/i18n-shared";

export async function getLocale(): Promise<Locale> {
  try {
    const store = await cookies();
    const raw = store.get(LOCALE_COOKIE)?.value;
    return isLocale(raw) ? raw : "en";
  } catch {
    return "en";
  }
}

export interface Translator {
  locale: Locale;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

export async function getTranslator(): Promise<Translator> {
  const locale = await getLocale();
  return { locale, t: (key, vars) => translate(locale, key, vars) };
}

export async function getLegal(kind: LegalKind): Promise<LegalContent | null> {
  const locale = await getLocale();
  return getLegalContent(locale, kind);
}

export { translate, getLegalContent, LOCALE_COOKIE };
export type { LegalContent, LegalKind, Locale };
