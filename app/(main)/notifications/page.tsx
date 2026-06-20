"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState, PageHeader } from "@/components/ui/EmptyState";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useApp } from "@/components/providers/AppProvider";
import { useI18n } from "@/components/providers/I18nProvider";
import { timeAgo, cn } from "@/lib/utils";
import type { NotificationType } from "@/types";

const TYPE_META: Record<NotificationType, { icon: IconName; color: string }> = {
  comment_reply: { icon: "reply", color: "text-accent" },
  topic_vote: { icon: "arrow-up", color: "text-success" },
  mention: { icon: "chat", color: "text-warning" },
  room_message: { icon: "rooms", color: "text-accent" },
  follow: { icon: "user", color: "text-accent" },
};

export default function NotificationsPage() {
  const { t, locale } = useI18n();
  const { notifications, markAllRead, markRead } = useApp();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const list = notifications.filter((n) => (filter === "unread" ? !n.isRead : true));
  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title={t("notifications.title")}
        description={unread > 0 ? t("notifications.unreadCount", { count: unread }) : t("notifications.allRead")}
        action={
          unread > 0 ? (
            <button type="button" onClick={markAllRead} className="btn-secondary">
              <Icon name="check" size={16} />
              {t("notifications.markAllRead")}
            </button>
          ) : undefined
        }
      />

      <div className="mb-4 flex gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label={t("notifications.filterAll")} />
        <FilterChip
          active={filter === "unread"}
          onClick={() => setFilter("unread")}
          label={t("notifications.filterUnread")}
          count={unread}
        />
      </div>

      {list.length > 0 ? (
        <div className="flex flex-col gap-2">
          {list.map((n) => {
            const meta = TYPE_META[n.type];
            return (
              <Link
                key={n.id}
                href={n.link}
                onClick={() => markRead(n.id)}
                className={cn(
                  "card flex items-start gap-3 py-4 transition-colors hover:border-text-secondary/30",
                  !n.isRead && "border-accent/40 bg-accent/5",
                )}
              >
                <div className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-btn bg-bg-tertiary", meta.color)}>
                  <Icon name={meta.icon} size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-text-primary">{n.title}</p>
                    {!n.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />}
                  </div>
                  {n.actor && (
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-text-secondary">
                      <Avatar user={n.actor} size={20} href={`/u/${n.actor.username}`} />
                      <span className="font-medium text-text-secondary">@{n.actor.username}</span>
                    </div>
                  )}
                  {n.body && (
                    <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{n.body}</p>
                  )}
                  <time className="mt-1 block text-xs text-text-secondary">{timeAgo(n.createdAt, locale)}</time>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon="bell"
          title={t("notifications.empty")}
          description={filter === "unread" ? t("notifications.emptyUnread") : t("notifications.emptyAll")}
        />
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-badge px-3 py-1.5 text-sm transition-colors",
        active ? "bg-accent text-white" : "bg-bg-tertiary text-text-secondary hover:text-text-primary",
      )}
    >
      {label}
      {typeof count === "number" && count > 0 && (
        <span className="rounded-badge bg-white/20 px-1.5 text-xs tabular-nums">{count}</span>
      )}
    </button>
  );
}
