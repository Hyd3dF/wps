import Link from "next/link";
import { TopicCardList } from "@/components/topic/TopicCard";
import { RoomCardGrid, StatItem } from "@/components/room/RoomCard";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatNumber } from "@/lib/utils";
import { getTranslator } from "@/lib/i18n";
import { backendGet } from "@/lib/backend-server";
import { toRoom, toTopic, type BackendRoom, type BackendTopic } from "@/lib/backend-content";

export default async function HomePage() {
  const { t } = await getTranslator();
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
  const activeMembers = Array.from(
    new Map(topics.map((topic) => [topic.author.username, topic.author])).values(),
  ).slice(0, 6);
  const popularTags = Array.from(new Set(topics.flatMap((topic) => topic.tags))).slice(0, 12);

  return (
    <div className="flex flex-col gap-6 relative">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
        <h1 className="text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
          <Icon name="trending" size={24} className="text-accent" />
          {t("home.trending")}
        </h1>
        <div className="flex items-center gap-3">
          <Link href="/rooms" className="btn-secondary hidden sm:inline-flex h-9">
            <Icon name="rooms" size={16} />
            {t("home.joinRooms")}
          </Link>
          <Link href="/new-topic" className="btn-primary h-9 shadow-lg shadow-accent/15">
            <Icon name="plus" size={16} />
            {t("home.newTopic")}
          </Link>
        </div>
      </div>

      <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col">
          <section>
            {trending.length > 0 ? (
              <TopicCardList topics={trending} />
            ) : (
              <EmptyState
                icon="trending"
                title={t("home.noTopics")}
                description={t("home.noTopicsDesc")}
                action={<Link href="/new-topic" className="btn-primary"><Icon name="plus" size={16} />{t("home.newTopic")}</Link>}
              />
            )}
          </section>
        </div>

        <aside className="flex flex-col gap-6 xl:sticky xl:top-[5rem]">
          <section>
            <SectionHeader title={t("home.liveRooms")} icon="rooms" href="/rooms" actionLabel={t("home.all")} />
            {featured.length > 0 ? (
              <div className="[&>div]:grid-cols-1"><RoomCardGrid rooms={featured.slice(0, 3)} /></div>
            ) : (
              <EmptyState icon="rooms" title={t("home.noRooms")} description={t("home.noRoomsDesc")} className="py-8" />
            )}
          </section>

          {popularTags.length > 0 && (
            <section className="card rounded-md">
              <h2 className="flex items-center gap-2 text-[13px] font-display font-semibold text-white">
                <Icon name="hash" size={16} className="text-accent" /> {t("home.popularTags")}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Link key={tag} href={`/explore?tag=${encodeURIComponent(tag)}`} className="badge-tag">#{tag}</Link>
                ))}
              </div>
            </section>
          )}

          {activeMembers.length > 0 && (
            <section className="card rounded-md">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-[13px] font-display font-semibold text-white">
                  <Icon name="users" size={16} className="text-accent" /> {t("home.activeMembers")}
                </h2>
                <Link href="/search?type=users" className="text-[11px] font-medium text-text-secondary hover:text-white transition-colors">{t("home.all")}</Link>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {activeMembers.slice(0, 5).map((member) => (
                  <Link key={member.username} href={`/u/${member.username}`} className="group flex items-center gap-3 py-3 first:pt-1 last:pb-0 transition-colors">
                    <Avatar user={member} size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-text-primary group-hover:text-white transition-colors">{member.displayName}</p>
                      <p className="truncate text-[11px] text-text-secondary/80 font-medium">@{member.username} · <span className="text-accent/80 font-mono">{formatNumber(member.reputation)}</span> {t("common.reputation")}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
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
      <h2 className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-white">
        <Icon name={icon} size={18} className="text-accent" />
        {title}
      </h2>
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-text-secondary transition-colors hover:text-white"
      >
        {actionLabel}
        <Icon name="chevron-right" size={14} className="text-text-secondary/50" />
      </Link>
    </div>
  );
}
