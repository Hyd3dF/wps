import { notFound } from "next/navigation";
import { ProfileView } from "@/components/user/ProfileView";
import type { Metadata } from "next";
import { backendGet } from "@/lib/backend-server";
import { toFrontendUser, type BackendUser } from "@/lib/backend-user";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const result = await backendGet<{ user: BackendUser }>(`users/${encodeURIComponent(username)}`);
  const user = result?.user;
  if (!user) return { title: "Kullanıcı bulunamadı" };
  const title = `${user.displayName || user.username} (@${user.username})`;
  const description = user.bio || `${user.username} kullanıcısının Oroya profili.`;
  return {
    title,
    description,
    alternates: { canonical: `/u/${user.username}` },
    openGraph: {
      type: "profile",
      url: `/u/${user.username}`,
      title,
      description,
      images: user.avatarUrl ? [{ url: user.avatarUrl }] : undefined,
    },
  };
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const result = await backendGet<{ user: BackendUser }>(`users/${encodeURIComponent(username)}`);
  if (!result?.user) notFound();
  const user = toFrontendUser(result.user);
  const sameAs = [user.websiteUrl, user.githubUrl, user.twitterUrl].filter(Boolean);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `https://oroya.xyz/u/${user.username}`,
    dateCreated: user.joinedAt,
    mainEntity: {
      "@type": "Person",
      name: user.displayName,
      alternateName: `@${user.username}`,
      description: user.bio || undefined,
      image: user.avatarUrl || undefined,
      url: `https://oroya.xyz/u/${user.username}`,
      sameAs,
    },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <ProfileView user={user} />
    </>
  );
}
