"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Icon, type IconName } from "@/components/ui/Icon";
import { OnlineDot, PrivateBadge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/utils";
import { useI18n } from "@/components/providers/I18nProvider";
import type { Room } from "@/types";

export function RoomCard({ room }: { room: Room }) {
  const { t } = useI18n();
  return (
    <Link
      href={`/rooms/${room.slug}`}
      className="group flex flex-col gap-2.5 border-b border-border bg-bg-secondary px-3.5 py-3.5 transition-colors first:rounded-t-card first:border-x first:border-t last:rounded-b-card last:border-x hover:bg-bg-tertiary/35"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn border border-accent/20 bg-accent/10 text-accent">
          <Icon name="hash" size={17} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-display font-semibold text-text-primary transition-colors group-hover:text-accent">
              {room.name}
            </h3>
            {room.isPrivate && <PrivateBadge />}
          </div>
          <p className="mt-0.5 line-clamp-1 text-sm text-text-secondary">
            {room.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-text-secondary">
        <span className="inline-flex items-center gap-1.5">
          <OnlineDot online={room.onlineCount > 0} />
          {formatNumber(room.onlineCount)} {t("common.online").toLowerCase()}
        </span>
        <span className="inline-flex items-center gap-1">
          <Icon name="users" size={14} />
          {formatNumber(room.memberCount)} {t("common.member")}
        </span>
        {room.isMember && (
          <span className="badge bg-success/15 text-success">{t("common.youAreMember")}</span>
        )}
      </div>
    </Link>
  );
}

export function RoomCardGrid({ rooms }: { rooms: Room[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rooms.map((r) => (
        <RoomCard key={r.id} room={r} />
      ))}
    </div>
  );
}

export function StatItem({
  icon,
  label,
  value,
}: {
  icon: IconName;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon name={icon} size={16} className="text-text-secondary" />
      <span className="font-semibold tabular-nums text-text-primary">{value}</span>
      <span className="text-text-secondary">{label}</span>
    </div>
  );
}
