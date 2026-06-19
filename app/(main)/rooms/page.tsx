import Link from "next/link";
import { RoomCardGrid } from "@/components/room/RoomCard";
import { EmptyState, PageHeader } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { formatNumber } from "@/lib/utils";
import { backendGet } from "@/lib/backend-server";
import { toRoom, type BackendRoom } from "@/lib/backend-content";

export default async function RoomsPage() {
  const response = await backendGet<{ rooms: BackendRoom[] }>("rooms");
  const rooms = (response?.rooms ?? []).map(toRoom);
  const joined = rooms.filter((r) => r.isMember);
  const publicRooms = rooms.filter((r) => !r.isPrivate);
  const privateRooms = rooms.filter((r) => r.isPrivate);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Odalar"
        description="Gerçek zamanlı sohbet odaları. Konuya göre değil, anlık paylaşıma göre."
        action={
          <Link href="/new-room" className="btn-primary">
            <Icon name="plus" size={16} />
            Yeni Oda
          </Link>
        }
      />

      {joined.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-text-primary">
            <Icon name="check" size={18} className="text-success" />
            Katıldığım Odalar
          </h2>
          <RoomCardGrid rooms={joined} />
        </section>
      )}

      <section>
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-text-primary">
          <Icon name="globe" size={18} className="text-accent" />
          Herkese Açık Odalar
        </h2>
        {publicRooms.length > 0 ? (
          <RoomCardGrid rooms={publicRooms} />
        ) : (
          <EmptyState
            icon="rooms"
            title="Henüz oda yok"
            description="İlk odayı sen kur, topluluğu topla."
            action={
              <Link href="/new-room" className="btn-primary">
                <Icon name="plus" size={16} />
                Oda Oluştur
              </Link>
            }
          />
        )}
      </section>

      {privateRooms.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-text-primary">
            <Icon name="lock" size={18} className="text-warning" />
            Özel Odalar
          </h2>
          <RoomCardGrid rooms={privateRooms} />
        </section>
      )}

      <div className="card flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-btn bg-accent/15 text-accent">
          <Icon name="rooms" size={20} />
        </div>
        <div>
          <h3 className="font-display font-semibold text-text-primary">
            Odalar nasıl çalışır?
          </h3>
          <p className="mt-1 text-sm text-text-secondary">
            Odalar kalıcı değil, anlık iletişim içindir. Bir oda oluştur,
            arkadaşlarını çağır, gerçek zamanlı mesajlaş. {formatNumber(rooms.length)}{" "}
            oda şu anda aktif.
          </p>
        </div>
      </div>
    </div>
  );
}
