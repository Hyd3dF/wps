import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Icon, type IconName } from "@/components/ui/Icon";
import { OnlineDot, PrivateBadge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/utils";
import type { Room } from "@/types";

export function RoomCard({ room }: { room: Room }) {
  return (
    <Link
      href={`/rooms/${room.slug}`}
      className="card group flex flex-col gap-3 transition-colors hover:border-text-secondary/30"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn bg-accent/15 text-accent">
          <Icon name="hash" size={20} />
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
          {formatNumber(room.onlineCount)} çevrimiçi
        </span>
        <span className="inline-flex items-center gap-1">
          <Icon name="users" size={14} />
          {formatNumber(room.memberCount)} üye
        </span>
        {room.isMember && (
          <span className="badge bg-success/15 text-success">Üyesin</span>
        )}
      </div>
    </Link>
  );
}

export function RoomCardGrid({ rooms }: { rooms: Room[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
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
