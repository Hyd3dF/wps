import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

interface LegalPageProps {
  title: string;
  updatedAt: string;
  description?: string;
  children: React.ReactNode;
}

export function LegalPage({
  title,
  updatedAt,
  description,
  children,
}: LegalPageProps) {
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
        {title}
      </h1>
      <p className="mt-2 text-sm text-text-secondary">
        Son güncelleme: {updatedAt}
      </p>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          {description}
        </p>
      )}
      <div className="prose-dark mt-8">{children}</div>
    </article>
  );
}
