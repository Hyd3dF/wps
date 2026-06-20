import Link from "next/link";
import { RoomCardGrid } from "@/components/room/RoomCard";
import { EmptyState, PageHeader } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { formatNumber } from "@/lib/utils";
import { backendGet } from "@/lib/backend-server";
import { toRoom, type BackendRoom } from "@/lib/backend-content";
import { getTranslator } from "@/lib/i18n";

export default async function RoomsPage() {
  const { t } = await getTranslator();
  const response = await backendGet<{ rooms: BackendRoom[] }>("rooms");
  const rooms = (response?.rooms ?? []).map(toRoom);
  const joined = rooms.filter((r) => r.isMember);
  const publicRooms = rooms.filter((r) => !r.isPrivate);
  const privateRooms = rooms.filter((r) => r.isPrivate);

  return (
    <div className="flex flex-col gap-10 relative">
      <PageHeader
        title={t("room.title")}
        description={t("room.subtitle")}
        action={
          <Link href="/new-room" className="btn-primary">
            <Icon name="plus" size={16} />
            {t("room.newRoom")}
          </Link>
        }
      />

      {joined.length > 0 && (
        <section className="relative z-10">
          <h2 className="mb-5 flex items-center gap-2.5 font-display text-[17px] font-bold text-white tracking-tight">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#27c93f]/10 text-[#27c93f]">
              <Icon name="check" size={16} />
            </span>
            {t("room.joinedRooms")}
          </h2>
          <RoomCardGrid rooms={joined} />
        </section>
      )}

      <section className="relative z-10">
        <h2 className="mb-5 flex items-center gap-2.5 font-display text-[17px] font-bold text-white tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10 text-accent">
            <Icon name="globe" size={16} />
          </span>
          {t("room.publicRooms")}
        </h2>
        {publicRooms.length > 0 ? (
          <RoomCardGrid rooms={publicRooms} />
        ) : (
          <EmptyState
            icon="rooms"
            title={t("room.noRooms")}
            description={t("room.noRoomsDesc")}
            action={
              <Link href="/new-room" className="btn-primary">
                <Icon name="plus" size={16} />
                {t("room.createRoom")}
              </Link>
            }
          />
        )}
      </section>

      {privateRooms.length > 0 && (
        <section className="relative z-10">
          <h2 className="mb-5 flex items-center gap-2.5 font-display text-[17px] font-bold text-white tracking-tight">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#ffbd2e]/10 text-[#ffbd2e]">
              <Icon name="lock" size={16} />
            </span>
            {t("room.privateRooms")}
          </h2>
          <RoomCardGrid rooms={privateRooms} />
        </section>
      )}

      <div className="card flex items-start gap-5 relative overflow-hidden mt-4">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent opacity-30" />
        <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20 shadow-inner">
          <Icon name="rooms" size={24} />
        </div>
        <div className="relative z-10">
          <h3 className="font-display text-[16px] font-bold text-white tracking-tight">
            {t("room.howTitle")}
          </h3>
          <p className="mt-1.5 text-[14px] text-text-secondary/90 leading-relaxed max-w-3xl">
            {t("room.howDesc", { count: formatNumber(rooms.length) })}
          </p>
        </div>
      </div>
    </div>
  );
}
