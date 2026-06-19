import type { MetadataRoute } from "next";
import { backendGet } from "@/lib/backend-server";
import type { BackendTopic } from "@/lib/backend-content";

const SITE_URL = "https://oroya.xyz";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const result = await backendGet<{ topics: BackendTopic[] }>("topics?sort=new&limit=100");
  const topics = result?.topics ?? [];
  const users = new Map<string, string>();
  for (const topic of topics) users.set(topic.authorUsername, topic.updatedAt);

  return [
    { url: SITE_URL, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/explore`, changeFrequency: "hourly", priority: 0.9 },
    ...topics.map((topic) => ({
      url: `${SITE_URL}/topics/${topic.id}`,
      lastModified: new Date(topic.updatedAt),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...Array.from(users, ([username, updatedAt]) => ({
      url: `${SITE_URL}/u/${username}`,
      lastModified: new Date(updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
