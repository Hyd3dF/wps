"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/types";
import { Icon, type IconName } from "@/components/ui/Icon";
import { TagBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/providers/I18nProvider";

export function Sidebar() {
  const { t } = useI18n();
  const pathname = usePathname();

  const NAV: { href: string; label: string; icon: IconName }[] = [
    { href: "/", label: t("nav.home"), icon: "home" },
    { href: "/explore", label: t("nav.explore"), icon: "explore" },
    { href: "/rooms", label: t("nav.rooms"), icon: "rooms" },
  ];

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
    <aside className="hidden w-[220px] shrink-0 lg:block border-r border-border bg-bg-primary pr-6 mr-6">
      <div className="sticky top-[4.5rem] flex max-h-[calc(100vh-5rem)] flex-col gap-6 overflow-y-auto scrollbar-thin pb-8">
        <nav className="flex flex-col gap-1.5 pt-2">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-all duration-200",
                  active
                    ? "bg-white/[0.06] text-white shadow-sm"
                    : "text-text-secondary hover:bg-white/[0.03] hover:text-white"
                )}
              >
                <Icon name={item.icon} size={16} className={cn(active ? "text-accent" : "text-text-secondary/70")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Section title={t("nav.categories")}>
          <div className="flex flex-col gap-1">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/explore?category=${c.id}`}
                className="group flex items-center gap-3 rounded-md px-3 py-1.5 text-[13px] text-text-secondary transition-colors hover:bg-white/[0.03] hover:text-white"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full ring-2 ring-transparent group-hover:ring-white/10 transition-all"
                  style={{ backgroundColor: c.color }}
                />
                {t(`category.${c.id}`)}
              </Link>
            ))}
          </div>
        </Section>

        {tags.length > 0 && (
          <Section title={t("nav.popularTags")}>
            <div className="flex flex-wrap gap-2 px-1">
              {tags.map((t) => (
                <TagBadge key={t} tag={t} />
              ))}
            </div>
          </Section>
        )}
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
    <div className="border-t border-border pt-5">
      <h2 className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-text-secondary/60">
        {title}
      </h2>
      {children}
    </div>
  );
}
