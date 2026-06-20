import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Landing } from "@/components/landing/Landing";
import { backendGet } from "@/lib/backend-server";
import { toRoom, toTopic, type BackendRoom, type BackendTopic } from "@/lib/backend-content";

export default async function RootPage() {
  const store = await cookies();
  const hasAccess = store.has("konu_access");

  if (hasAccess) {
    redirect("/home");
  }

  const [topicResponse, roomResponse] = await Promise.all([
    backendGet<{ topics: BackendTopic[] }>("topics?sort=trending&limit=30"),
    backendGet<{ rooms: BackendRoom[] }>("rooms"),
  ]);
  const topics = (topicResponse?.topics ?? []).map(toTopic);
  const rooms = (roomResponse?.rooms ?? []).map(toRoom);
  const activeMembers = Array.from(
    new Map(topics.map((topic) => [topic.author.username, topic.author])).values(),
  );

  return (
    <Landing
      stats={{
        topicsCount: topics.length,
        roomsCount: rooms.length,
        membersCount: activeMembers.length || 6,
      }}
    />
  );
}
