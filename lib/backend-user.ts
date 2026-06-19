import type { User } from "@/types";

export interface BackendUser {
  id: string;
  username: string;
  email?: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  websiteUrl: string | null;
  githubUrl: string | null;
  twitterUrl: string | null;
  reputation: number;
  createdAt: string;
  topicCount?: number;
  commentCount?: number;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
}

export function toFrontendUser(user: BackendUser): User {
  return {
    id: user.id,
    username: user.username,
    email: user.email ?? "",
    displayName: user.displayName || user.username,
    bio: user.bio ?? "",
    avatarUrl: user.avatarUrl,
    websiteUrl: user.websiteUrl,
    githubUrl: user.githubUrl,
    twitterUrl: user.twitterUrl,
    reputation: user.reputation,
    topicCount: user.topicCount ?? 0,
    commentCount: user.commentCount ?? 0,
    followersCount: user.followersCount ?? 0,
    followingCount: user.followingCount ?? 0,
    joinedAt: user.createdAt,
    isFollowing: user.isFollowing,
  };
}
