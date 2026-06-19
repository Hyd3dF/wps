"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/components/providers/I18nProvider";

interface LegalPageProps {
  kind?: "terms" | "privacy" | "refund";
  title: string;
  updatedAt: string;
  description?: string;
  children: React.ReactNode;
}

export function LegalPage({
  kind,
  title,
  updatedAt,
  description,
  children,
}: LegalPageProps) {
  const { legal, locale } = useI18n();
  const translated = kind ? legal(kind) : null;
  const displayTitle = translated?.title ?? title;
  const displayDescription = translated?.description ?? description;
  const displayUpdatedAt = translated?.updatedAt ?? updatedAt;

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        <Icon name="chevron-right" size={16} className="rotate-180" />
        Ana sayfaya dön
      </Link>
      <h1 className="mt-6 text-3xl font-display font-extrabold tracking-tight text-text-primary sm:text-4xl">
        {displayTitle}
      </h1>
      <p className="mt-2 text-sm text-text-secondary">
        Son güncelleme: {displayUpdatedAt}
      </p>
      {displayDescription && (
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          {displayDescription}
        </p>
      )}
      <div className="prose-dark mt-8">
        {locale === "en" && translated
          ? translated.sections.map(([heading, body]) => (
              <section key={heading}>
                <h2>{heading}</h2>
                <p>{body}</p>
              </section>
            ))
          : children}
      </div>
    </article>
  );
}
