export type Category = string;

export interface DynamicCategory {
  id: string;
  label: string;
  color: string;
  createdBy?: string;
}

export const CATEGORIES: { id: Category; label: string; color: string }[] = [
  { id: "general", label: "Genel", color: "#9999AA" },
  { id: "dev", label: "Geliştirme", color: "#6C63FF" },
  { id: "design", label: "Tasarım", color: "#EC4899" },
  { id: "startup", label: "Startup", color: "#22C55E" },
  { id: "offtopic", label: "Off-topic", color: "#F59E0B" },
];

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  websiteUrl: string | null;
  githubUrl: string | null;
  twitterUrl: string | null;
  reputation: number;
  topicCount: number;
  commentCount: number;
  followersCount: number;
  followingCount: number;
  joinedAt: string;
  isFollowing?: boolean;
  lastActiveAt?: string | null;
}

export interface Topic {
  id: string;
  userId: string;
  author: User;
  title: string;
  body: string;
  category: Category;
  tags: string[];
  upvotes: number;
  downvotes: number;
  viewCount: number;
  commentCount: number;
  isPinned: boolean;
  isSaved: boolean;
  myVote: 1 | -1 | 0;
  createdAt: string;
  updatedAt: string;
}

export interface UserComment {
  id: string;
  topicId: string;
  topicTitle: string;
  body: string;
  upvotes: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  topicId: string;
  userId: string;
  author: User;
  parentId: string | null;
  body: string;
  upvotes: number;
  downvotes: number;
  depth: number;
  myVote: 1 | -1 | 0;
  children: Comment[];
  createdAt: string;
}

export interface Room {
  id: string;
  ownerId: string;
  owner: User;
  name: string;
  description: string;
  slug: string;
  isPrivate: boolean;
  memberCount: number;
  onlineCount: number;
  isMember: boolean;
  lastMessage: RoomMessage | null;
  createdAt: string;
}

export interface RoomMessage {
  id: string;
  roomId: string;
  userId: string;
  author: User;
  type: "text" | "image" | "file";
  content: string;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  createdAt: string;
}

export interface RoomMember {
  userId: string;
  user: User;
  role: "owner" | "admin" | "member";
  isOnline: boolean;
  joinedAt: string;
}

export type NotificationType =
  | "comment_reply"
  | "topic_vote"
  | "mention"
  | "room_message"
  | "follow";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string;
  isRead: boolean;
  actor: User | null;
  createdAt: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  activityType: "login" | "logout" | "topic_create" | "comment_create" | "vote" | "save";
  targetId: string | null;
  targetTitle: string | null;
  createdAt: string;
}
