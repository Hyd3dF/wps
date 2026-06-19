"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/types";
import { Icon, type IconName } from "@/components/ui/Icon";
import { TagBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Ana Sayfa", icon: "home" },
  { href: "/explore", label: "Keşfet", icon: "explore" },
  { href: "/rooms", label: "Odalar", icon: "rooms" },
  { href: "/new-topic", label: "Konu Aç", icon: "plus" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/backend/topics?sort=trending&limit=30")
      .then((r) => r.json())
      .then((data) => {
        if (data?.topics) {
          const allTags = data.topics.flatMap((t: any) => t.tags || []);
          const uniqueTags = Array.from(new Set(allTags)) as string[];
          setTags(uniqueTags.slice(0, 10));
        }
      })
      .catch(() => undefined);
  }, []);

  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <div className="sticky top-[4.5rem] flex max-h-[calc(100vh-5rem)] flex-col gap-6 overflow-y-auto scrollbar-thin pb-8">
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("nav-link", active && "nav-link-active")}
              >
                <Icon name={item.icon} size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Section title="Kategoriler">
          <div className="flex flex-col gap-0.5">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/explore?category=${c.id}`}
                className="flex items-center gap-2.5 rounded-btn px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
                {c.label}
              </Link>
            ))}
          </div>
        </Section>

        {tags.length > 0 && (
          <Section title="Popüler Etiketler">
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <TagBadge key={t} tag={t} />
              ))}
            </div>
          </Section>
        )}

        <div className="rounded-card border border-border bg-bg-secondary p-4">
          <p className="text-sm font-display font-semibold text-text-primary">
            Slogan
          </p>
          <p className="mt-1 text-xs leading-relaxed text-text-secondary">
            &ldquo;Düşüncen tweet olmasın. Oroya&rsquo;da açsın.&rdquo;
          </p>
        </div>
      </div>
    </aside>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
        {title}
      </h2>
      {children}
    </div>
  );
}
