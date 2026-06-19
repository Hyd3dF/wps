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
  return { title: `${user.displayName} (@${user.username})` };
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const result = await backendGet<{ user: BackendUser }>(`users/${encodeURIComponent(username)}`);
  if (!result?.user) notFound();
  return <ProfileView user={toFrontendUser(result.user)} />;
}
