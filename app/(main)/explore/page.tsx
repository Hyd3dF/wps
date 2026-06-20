"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { TopicCardList } from "@/components/topic/TopicCard";
import { EmptyState, PageHeader } from "@/components/ui/EmptyState";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useI18n } from "@/components/providers/I18nProvider";
import { CATEGORIES } from "@/types";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";
import { toTopic, type BackendTopic } from "@/lib/backend-content";
import type { Topic } from "@/types";

type Sort = "trending" | "new" | "top";

const SORTS: { id: Sort; key: string; icon: IconName }[] = [
  { id: "trending", key: "explore.sortTrending", icon: "trending" },
  { id: "new", key: "explore.sortNew", icon: "clock" },
  { id: "top", key: "explore.sortTop", icon: "arrow-up" },
];

function ExploreContent() {
  const { t } = useI18n();
  const sp = useSearchParams();
  const [sort, setSort] = useState<Sort>(
    (sp.get("sort") as Sort) || "trending",
  );
  const [category, setCategory] = useState<Category | "all">(
    (sp.get("category") as Category) || "all",
  );
  const [tag, setTag] = useState<string | null>(sp.get("tag"));
  const [search, setSearch] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ sort, limit: "50" });
    if (category !== "all") query.set("category", category);
    if (tag) query.set("tag", tag);
    const load = async () => {
      await Promise.resolve();
      setLoading(true);
      setLoadError("");
      try {
        const response = await fetch(`/api/backend/topics?${query}`, { signal: controller.signal, cache: "no-store" });
        const data = await response.json().catch(() => null) as
          | { topics?: BackendTopic[]; error?: { message?: string } }
          | null;
        if (!response.ok) throw new Error(data?.error?.message || t("explore.loadError"));
        setTopics((data?.topics ?? []).map(toTopic));
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") setLoadError(error.message);
      } finally {
        setLoading(false);
      }
    };
    void load();
    return () => controller.abort();
  }, [sort, category, tag, t]);

  const popularTags = useMemo(
    () => Array.from(new Set(topics.flatMap((topic) => topic.tags))).slice(0, 12),
    [topics],
  );

  const filtered = useMemo(() => {
    let list = [...topics];
    if (category !== "all") list = list.filter((t) => t.category === category);
    if (tag) list = list.filter((t) => t.tags.includes(tag));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.body.toLowerCase().includes(q) ||
          t.tags.some((tg) => tg.includes(q)),
      );
    }
    if (sort === "new") {
      list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    } else if (sort === "top") {
      list.sort((a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes));
    } else {
      list.sort(
        (a, b) =>
          b.upvotes + b.commentCount * 1.5 + b.viewCount * 0.1 -
          (a.upvotes + a.commentCount * 1.5 + a.viewCount * 0.1),
      );
    }
    return list;
  }, [sort, category, tag, search, topics]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("explore.title")}
        description={t("explore.subtitle")}
      />

      <div className="card flex flex-col gap-4 py-4">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
            <Icon name="search" size={18} />
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("explore.searchPlaceholder")}
            className="input pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {t("explore.sort")}
          </span>
          {SORTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSort(s.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-badge px-3 py-1.5 text-sm transition-colors",
                sort === s.id
                  ? "bg-accent text-white"
                  : "bg-bg-tertiary text-text-secondary hover:text-text-primary",
              )}
            >
              <Icon name={s.icon} size={14} />
              {t(s.key)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {t("explore.categoryLabel")}
          </span>
          <FilterChip
            active={category === "all"}
            onClick={() => setCategory("all")}
            label={t("common.all")}
          />
          {CATEGORIES.map((c) => {
            // Translate categories based on dictionary key or use fallback
            const categoryLabel = t(`category.${c.id}`) !== `category.${c.id}` ? t(`category.${c.id}`) : c.label;
            return (
              <FilterChip
                key={c.id}
                active={category === c.id}
                onClick={() => setCategory(c.id)}
                label={categoryLabel}
                color={c.color}
              />
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {t("explore.tagLabel")}
          </span>
          <FilterChip
            active={tag === null}
            onClick={() => setTag(null)}
            label={t("common.all")}
          />
          {popularTags.slice(0, 12).map((t) => (
            <FilterChip
              key={t}
              active={tag === t}
              onClick={() => setTag(t)}
              label={`#${t}`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span>{t("explore.resultCount", { count: filtered.length })}</span>
      </div>

      {loadError ? (
        <EmptyState icon="explore" title={t("explore.loadError")} description={loadError} />
      ) : loading ? (
        <div className="card text-sm text-text-secondary">{t("common.loading")}</div>
      ) : filtered.length > 0 ? (
        <TopicCardList topics={filtered} />
      ) : (
        <EmptyState
          icon="explore"
          title={t("explore.noResults")}
          description={t("explore.noResultsDesc")}
        />
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-badge px-3 py-1.5 text-sm transition-colors",
        active
          ? "bg-accent text-white"
          : "bg-bg-tertiary text-text-secondary hover:text-text-primary",
      )}
    >
      {color && (
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: active ? "white" : color }}
        />
      )}
      {label}
    </button>
  );
}

export default function ExplorePage() {
  const { t } = useI18n();
  return (
    <Suspense fallback={<div className="card">{t("common.loading")}</div>}>
      <ExploreContent />
    </Suspense>
  );
}
