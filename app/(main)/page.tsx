import Link from "next/link";
import { TopicCardList } from "@/components/topic/TopicCard";
import { RoomCardGrid, StatItem } from "@/components/room/RoomCard";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatNumber } from "@/lib/utils";
import { backendGet } from "@/lib/backend-server";
import { toRoom, toTopic, type BackendRoom, type BackendTopic } from "@/lib/backend-content";

export default async function HomePage() {
  const [topicResponse, roomResponse] = await Promise.all([
    backendGet<{ topics: BackendTopic[] }>("topics?sort=trending&limit=20"),
    backendGet<{ rooms: BackendRoom[] }>("rooms"),
  ]);
  const topics = (topicResponse?.topics ?? []).map(toTopic);
  const rooms = (roomResponse?.rooms ?? []).map(toRoom);
  const trending = [...topics].sort(
    (a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes),
  );
  const featured = rooms.slice(0, 4);
  const recent = [...topics].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
  const activeMembers = Array.from(
    new Map(topics.map((topic) => [topic.author.username, topic.author])).values(),
  ).slice(0, 6);
  const popularTags = Array.from(new Set(topics.flatMap((topic) => topic.tags))).slice(0, 12);

  return (
    <div className="flex flex-col gap-8">
      <section className="overflow-hidden rounded-card border border-border bg-gradient-to-br from-accent/15 via-bg-secondary to-bg-secondary p-6 sm:p-8">
        <div className="max-w-2xl">
          <span className="badge bg-accent/20 text-accent">
            <Icon name="fire" size={12} className="mr-1" />
            Beta
          </span>
          <h1 className="mt-3 text-3xl font-display font-extrabold leading-tight tracking-tight text-text-primary sm:text-4xl">
            Düşüncen tweet olmasın.
            <br />
            <span className="text-accent">Oroya&rsquo;da açsın.</span>
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-text-secondary">
            Geliştiriciler için konu-odaklı sosyal platform. Kalıcı, aranabilir,
            büyüyen tartışmalar. Gerçek zamanlı odalar. İtibar, vanity değil.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/new-topic" className="btn-primary">
              <Icon name="plus" size={16} />
              İlk konunu aç
            </Link>
            <Link href="/explore" className="btn-secondary">
              <Icon name="explore" size={16} />
              Keşfet
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="card flex items-center gap-3 py-4">
          <StatItem icon="chat" label="aktif konu" value={topics.length} />
        </div>
        <div className="card flex items-center gap-3 py-4">
          <StatItem icon="rooms" label="oda" value={rooms.length} />
        </div>
        <div className="card flex items-center gap-3 py-4">
          <StatItem icon="users" label="üye" value={activeMembers.length} />
        </div>
      </section>

      <section>
        <SectionHeader
          title="Trend Konular"
          icon="trending"
          href="/explore?sort=trending"
          actionLabel="Tümünü gör"
        />
        {trending.length > 0 ? (
          <TopicCardList topics={trending.slice(0, 4)} />
        ) : (
          <EmptyState
            icon="trending"
            title="Henüz konu yok"
            description="İlk konuyu sen aç, tartışma başlasın."
            action={
              <Link href="/new-topic" className="btn-primary">
                <Icon name="plus" size={16} />
                Konu Aç
              </Link>
            }
          />
        )}
      </section>

      <section>
        <SectionHeader
          title="Öne Çıkan Odalar"
          icon="rooms"
          href="/rooms"
          actionLabel="Tüm odalar"
        />
        {featured.length > 0 ? (
          <RoomCardGrid rooms={featured} />
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

      <section>
        <SectionHeader
          title="Son Konular"
          icon="clock"
          href="/explore?sort=new"
          actionLabel="Tümünü gör"
        />
        {recent.length > 0 ? (
          <TopicCardList topics={recent.slice(0, 4)} />
        ) : (
          <EmptyState
            icon="clock"
            title="Henüz konu yok"
            description="Açılan konular burada listelenecek."
          />
        )}
      </section>

      {popularTags.length > 0 && (
        <section className="card">
          <div className="flex items-center gap-2">
            <Icon name="hash" size={18} className="text-accent" />
            <h2 className="font-display font-semibold text-text-primary">
              Popüler Etiketler
            </h2>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {popularTags.map((t) => (
              <Link
                key={t}
                href={`/explore?tag=${encodeURIComponent(t)}`}
                className="badge-tag"
              >
                <span className="text-text-secondary/70">#</span>
                {t}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionHeader
          title="Aktif Üyeler"
          icon="users"
          href="/search?type=users"
          actionLabel="Daha fazla"
        />
        {activeMembers.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeMembers.map((m) => (
              <Link
                key={m.username}
                href={`/u/${m.username}`}
                className="card flex items-center gap-3 transition-colors hover:border-text-secondary/30"
              >
                <Avatar user={m} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-text-primary">
                    {m.displayName}
                  </p>
                  <p className="truncate text-xs text-text-secondary">
                    @{m.username} · {formatNumber(m.reputation)} itibar
                  </p>
                </div>
                <Icon name="chevron-right" size={18} className="text-text-secondary" />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="users"
            title="Henüz üye yok"
            description="Topluluk büyüdükçe aktif üyeler burada görünür."
          />
        )}
      </section>
    </div>
  );
}

function SectionHeader({
  title,
  icon,
  href,
  actionLabel,
}: {
  title: string;
  icon: Parameters<typeof Icon>[0]["name"];
  href: string;
  actionLabel: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-text-primary">
        <Icon name={icon} size={20} className="text-accent" />
        {title}
      </h2>
      <Link
        href={href}
        className="inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-accent"
      >
        {actionLabel}
        <Icon name="chevron-right" size={16} />
      </Link>
    </div>
  );
}
