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

type SearchType = "topics" | "users" | "rooms";

const TYPES: { id: SearchType; label: string; icon: IconName }[] = [
  { id: "topics", label: "Konular", icon: "chat" },
  { id: "users", label: "Kullanıcılar", icon: "user" },
  { id: "rooms", label: "Odalar", icon: "rooms" },
];

function SearchContent() {
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
        if (!response.ok) throw new Error("Arama başarısız");
        const data = await response.json();
        setResults({
          topics: (data.topics || []).map(toTopic),
          users: (data.users || []).map(toFrontendUser),
          rooms: (data.rooms || []).map(toRoom),
        });
      } catch (err) {
        console.error("Arama hatası", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const count = results[type].length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Arama" description="Konu, kullanıcı ve oda ara." />

      <div className="card flex flex-col gap-4 py-4">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
            <Icon name="search" size={18} />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ara: react, saas, mertdemir..."
            autoFocus
            className="input pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setType(t.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-badge px-3 py-1.5 text-sm transition-colors",
                type === t.id
                  ? "bg-accent text-white"
                  : "bg-bg-tertiary text-text-secondary hover:text-text-primary",
              )}
            >
              <Icon name={t.icon} size={14} />
              {t.label}
              {results[t.id].length > 0 && (
                <span className="ml-1 text-xs tabular-nums opacity-80">
                  {results[t.id].length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {query.trim() === "" ? (
        <EmptyState
          icon="search"
          title="Bir şey ara"
          description="Yukarıdaki kutuya aramak istediğin terimi yaz."
        />
      ) : loading ? (
        <div className="py-12 text-center text-text-secondary">Aranıyor...</div>
      ) : count === 0 ? (
        <EmptyState
          icon="search"
          title="Sonuç bulunamadı"
          description={`"${query}" için ${type === "topics" ? "konu" : type === "users" ? "kullanıcı" : "oda"} yok.`}
        />
      ) : type === "topics" ? (
        <TopicCardList topics={results.topics} />
      ) : type === "rooms" ? (
        <RoomCardGrid rooms={results.rooms} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {results.users.map((u) => (
            <Link
              key={u.id}
              href={`/u/${u.username}`}
              className="card flex items-center gap-3 transition-colors hover:border-text-secondary/30"
            >
              <Avatar user={u} size={44} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-text-primary">{u.displayName}</p>
                <p className="truncate text-xs text-text-secondary">
                  @{u.username} · {formatNumber(u.reputation)} itibar
                </p>
                <p className="mt-1 line-clamp-1 text-xs text-text-secondary">{u.bio}</p>
              </div>
              <Icon name="chevron-right" size={18} className="text-text-secondary" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="card">Yükleniyor...</div>}>
      <SearchContent />
    </Suspense>
  );
}
