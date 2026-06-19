"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import en from "@/messages/en.json";

export type Locale = "tr" | "en";
type LegalKey = keyof typeof en.legal;

interface I18nValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (text: string) => string;
  legal: (key: LegalKey) => (typeof en.legal)[LegalKey] | null;
}

const I18nContext = createContext<I18nValue | null>(null);
const phrases = en.phrases as Record<string, string>;
const originals = new WeakMap<Node, string>();
const applied = new WeakMap<Node, string>();
const attributeOriginals = new WeakMap<Element, Map<string, string>>();
const translatedAttributes = ["placeholder", "title", "aria-label"];

function translateText(text: string): string {
  const direct = phrases[text.trim()];
  if (direct) return text.replace(text.trim(), direct);

  let result = text;
  for (const [source, target] of Object.entries(phrases).sort((a, b) => b[0].length - a[0].length)) {
    if (source.length >= 4 && result.includes(source)) result = result.replaceAll(source, target);
  }
  return result;
}

function shouldSkip(node: Node): boolean {
  const parent = node.nodeType === Node.ELEMENT_NODE ? node as Element : node.parentElement;
  return Boolean(parent?.closest("script,style,code,pre,.prose-dark,[data-no-i18n]"));
}

function localizeTree(root: ParentNode, locale: Locale): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);

  for (const node of nodes) {
    if (shouldSkip(node) || !node.textContent?.trim()) continue;
    if (!originals.has(node) || (applied.has(node) && applied.get(node) !== node.textContent)) {
      originals.set(node, node.textContent);
    }
    const original = originals.get(node) || node.textContent;
    const next = locale === "en" ? translateText(original) : original;
    if (node.textContent !== next) node.textContent = next;
    applied.set(node, next);
  }

  const elements = root instanceof Element ? [root, ...Array.from(root.querySelectorAll("*"))] : Array.from(root.querySelectorAll("*"));
  for (const element of elements) {
    if (shouldSkip(element)) continue;
    let stored = attributeOriginals.get(element);
    if (!stored) {
      stored = new Map();
      attributeOriginals.set(element, stored);
    }
    for (const attribute of translatedAttributes) {
      const current = element.getAttribute(attribute);
      if (!current) continue;
      if (!stored.has(attribute)) stored.set(attribute, current);
      const original = stored.get(attribute) || current;
      const next = locale === "en" ? translateText(original) : original;
      if (current !== next) element.setAttribute(attribute, next);
    }
  }
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, updateLocale] = useState<Locale>("tr");

  useEffect(() => {
    const saved = window.localStorage.getItem("oroya_locale");
    const cookieLocale = document.cookie.match(/(?:^|; )oroya_locale=(tr|en)/)?.[1];
    const browserLocale = navigator.language.toLowerCase().startsWith("en") ? "en" : "tr";
    updateLocale((saved === "en" || saved === "tr" ? saved : cookieLocale || browserLocale) as Locale);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    localizeTree(document.body, locale);
    let applying = false;
    const observer = new MutationObserver((mutations) => {
      if (applying) return;
      applying = true;
      for (const mutation of mutations) {
        if (mutation.type === "characterData" && mutation.target.parentElement) {
          localizeTree(mutation.target.parentElement, locale);
        }
        for (const node of Array.from(mutation.addedNodes)) {
          if (node.nodeType === Node.ELEMENT_NODE) localizeTree(node as Element, locale);
          if (node.nodeType === Node.TEXT_NODE && node.parentElement) localizeTree(node.parentElement, locale);
        }
      }
      applying = false;
    });
    observer.observe(document.body, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    window.localStorage.setItem("oroya_locale", next);
    document.cookie = `oroya_locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    updateLocale(next);
  }, []);

  const value = useMemo<I18nValue>(() => ({
    locale,
    setLocale,
    t: (text) => locale === "en" ? translateText(text) : text,
    legal: (key) => locale === "en" ? en.legal[key] : null,
  }), [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
