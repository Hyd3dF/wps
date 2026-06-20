"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { TopicCardList } from "@/components/topic/TopicCard";
import { RoomCardGrid } from "@/components/room/RoomCard";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState, PageHeader } from "@/components/ui/EmptyState";
import { Icon, type IconName } from "@/components/ui/Icon";
import { formatNumber, cn } from "@/lib/utils";
import type { Topic, User, Room } from "@/types";
import { toTopic, toRoom } from "@/lib/backend-content";
import { toFrontendUser } from "@/lib/backend-user";
import { useI18n } from "@/components/providers/I18nProvider";

type SearchType = "topics" | "users" | "rooms";

const TYPES: { id: SearchType; labelKey: string; icon: IconName }[] = [
  { id: "topics", labelKey: "search.typeTopics", icon: "chat" },
  { id: "users", labelKey: "search.typeUsers", icon: "user" },
  { id: "rooms", labelKey: "search.typeRooms", icon: "rooms" },
];

function SearchContent() {
  const { t } = useI18n();
  const sp = useSearchParams();
  const [query, setQuery] = useState(sp.get("q") ?? "");
  const [type, setType] = useState<SearchType>((sp.get("type") as SearchType) ?? "topics");
  const [results, setResults] = useState<{ topics: Topic[]; users: User[]; rooms: Room[] }>({
    topics: [],
    users: [],
    rooms: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults({ topics: [], users: [], rooms: [] });
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/backend/search?q=${encodeURIComponent(q)}`);
        if (!response.ok) throw new Error(t("search.error"));
        const data = await response.json();
        setResults({
          topics: (data.topics || []).map(toTopic),
          users: (data.users || []).map(toFrontendUser),
          rooms: (data.rooms || []).map(toRoom),
        });
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, t]);

  const count = results[type].length;

  const typeLabel =
    type === "topics"
      ? t("search.noResultsTypeTopics")
      : type === "users"
      ? t("search.noResultsTypeUsers")
      : t("search.noResultsTypeRooms");

  return (
    <div className="flex flex-col gap-6 relative">
      <PageHeader title={t("search.title")} description={t("search.subtitle")} />

      <div className="card flex flex-col gap-5 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-50" />
        
        <div className="relative z-10">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/60">
            <Icon name="search" size={18} />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder")}
            autoFocus
            className="input pl-10 rounded-xl h-12 text-[14px] font-medium tracking-wide shadow-inner"
          />
        </div>

        <div className="flex flex-wrap gap-2.5 relative z-10">
          {TYPES.map((tItem) => (
            <button
              key={tItem.id}
              type="button"
              onClick={() => setType(tItem.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300",
                type === tItem.id
                  ? "bg-accent text-white shadow-lg shadow-accent/20 ring-1 ring-accent/50 scale-105"
                  : "bg-white/[0.03] text-text-secondary hover:text-white hover:bg-white/[0.06]",
              )}
            >
              <Icon name={tItem.icon} size={14} className={type === tItem.id ? "text-white" : "text-text-secondary/70"} />
              {t(tItem.labelKey)}
              {results[tItem.id].length > 0 && (
                <span className={cn(
                  "ml-1 flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-mono",
                  type === tItem.id ? "bg-white/20 text-white" : "bg-white/[0.05] text-text-secondary"
                )}>
                  {results[tItem.id].length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 relative z-10">
        {query.trim() === "" ? (
          <EmptyState
            icon="search"
            title={t("search.emptyTitle")}
            description={t("search.emptyDesc")}
          />
        ) : loading ? (
          <div className="py-20 text-center animate-pulse">
            <Icon name="search" size={32} className="mx-auto mb-4 text-text-secondary/20" />
            <p className="text-[13px] font-medium text-text-secondary/60">{t("common.searching")}</p>
          </div>
        ) : count === 0 ? (
          <EmptyState
            icon="search"
            title={t("search.noResults")}
            description={t("search.noResultsDesc", { query, type: typeLabel })}
          />
        ) : type === "topics" ? (
          <TopicCardList topics={results.topics} />
        ) : type === "rooms" ? (
          <RoomCardGrid rooms={results.rooms} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {results.users.map((u) => (
              <Link
                key={u.id}
                href={`/u/${u.username}`}
                className="card group flex items-center gap-4 relative overflow-hidden"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Avatar user={u} size={48} className="ring-1 ring-white/[0.05] group-hover:ring-accent/30 transition-colors" />
                <div className="min-w-0 flex-1 relative z-10">
                  <p className="truncate text-[14px] font-bold text-white group-hover:text-accent transition-colors">{u.displayName}</p>
                  <p className="truncate text-[12px] text-text-secondary/80 font-medium">
                    @{u.username} · <span className="text-accent/80 font-mono">{formatNumber(u.reputation)}</span> {t("common.reputation")}
                  </p>
                  <p className="mt-1 line-clamp-1 text-[12px] text-text-secondary leading-relaxed">{u.bio}</p>
                </div>
                <Icon name="chevron-right" size={18} className="text-text-secondary/40 group-hover:text-accent transition-colors relative z-10 translate-x-0 group-hover:translate-x-1 duration-300" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center animate-pulse"><div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto"></div></div>}>
      <SearchContent />
    </Suspense>
  );
}
