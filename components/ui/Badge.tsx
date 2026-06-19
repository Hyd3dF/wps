import Link from "next/link";
import { CATEGORIES } from "@/types";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

export function CategoryBadge({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) {
  const cat = CATEGORIES.find((c) => c.id === category);
  if (!cat) return null;
  return (
    <span
      className={cn("badge-category", className)}
      style={{ color: cat.color }}
    >
      {cat.label}
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
  return (
    <span className="badge bg-accent/15 text-accent">
      <Icon name="pin" size={12} className="mr-1" />
      Sabit
    </span>
  );
}

export function PrivateBadge() {
  return (
    <span className="badge bg-warning/15 text-warning">
      <Icon name="lock" size={12} className="mr-1" />
      Özel
    </span>
  );
}

export function OnlineDot({ online }: { online: boolean }) {
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        online ? "bg-success" : "bg-text-secondary/40",
      )}
      aria-label={online ? "Çevrimiçi" : "Çevrimdışı"}
    />
  );
}
