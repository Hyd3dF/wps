"use client";

import Link from "next/link";
import { CATEGORIES } from "@/types";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/components/providers/I18nProvider";

export function CategoryBadge({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) {
  const { t } = useI18n();
  const cat = CATEGORIES.find((c) => c.id === category);
  if (!cat) return null;
  return (
    <span
      className={cn("badge-category", className)}
      style={{ color: cat.color }}
    >
      {t(`category.${cat.id}`)}
    </span>
  );
}

export function TagBadge({
  tag,
  className,
}: {
  tag: string;
  className?: string;
}) {
  return (
    <Link
      href={`/explore?tag=${encodeURIComponent(tag)}`}
      className={cn("badge-tag", className)}
    >
      <span className="text-text-secondary/70">#</span>
      {tag}
    </Link>
  );
}

export function TagList({ tags, className }: { tags: string[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {tags.map((t) => (
        <TagBadge key={t} tag={t} />
      ))}
    </div>
  );
}

export function PinBadge() {
  const { t } = useI18n();
  return (
    <span className="badge bg-accent/15 text-accent">
      <Icon name="pin" size={12} className="mr-1" />
      {t("common.pinned")}
    </span>
  );
}

export function PrivateBadge() {
  const { t } = useI18n();
  return (
    <span className="badge bg-warning/15 text-warning">
      <Icon name="lock" size={12} className="mr-1" />
      {t("common.private")}
    </span>
  );
}

export function OnlineDot({ online }: { online: boolean }) {
  const { t } = useI18n();
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        online ? "bg-success" : "bg-text-secondary/40",
      )}
      aria-label={online ? t("common.online") : t("common.offline")}
    />
  );
}
