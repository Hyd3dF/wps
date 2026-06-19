import { notFound } from "next/navigation";
import Link from "next/link";
import { RoomChat } from "@/components/room/RoomChat";
import { Icon } from "@/components/ui/Icon";
import type { Metadata } from "next";
import { backendGet } from "@/lib/backend-server";
import { toRoom, type BackendRoom } from "@/lib/backend-content";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await backendGet<{ room: BackendRoom }>(`rooms/${encodeURIComponent(slug)}`);
  const room = result?.room;
  if (!room) return { title: "Oda bulunamadı" };
  return { title: `#${room.name}`, description: room.description || undefined };
}

export default async function RoomDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await backendGet<{ room: BackendRoom }>(`rooms/${encodeURIComponent(slug)}`);
  if (!result?.room) notFound();
  const room = toRoom(result.room);

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/rooms"
        className="inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        <Icon name="chevron-right" size={16} className="rotate-180" />
        Tüm odalar
      </Link>
      <RoomChat room={room} initialMessages={[]} members={[]} />
    </div>
  );
}
