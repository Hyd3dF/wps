import type {
  User,
  Topic,
  Comment,
  Room,
  RoomMessage,
  RoomMember,
  AppNotification,
} from "@/types";

export const currentUser: User | null = null;

export const users: User[] = [];
export const topics: Topic[] = [];
export const rooms: Room[] = [];
export const roomMessages: Record<string, RoomMessage[]> = {};
export const roomMembers: Record<string, RoomMember[]> = {};
export const notifications: AppNotification[] = [];
export const popularTags: string[] = [];
export const savedTopicIds: string[] = [];

export function getUserByUsername(_username: string): User | undefined {
  return undefined;
}

export function getTopicsByUser(_userId: string): Topic[] {
  return [];
}

export interface UserComment {
  id: string;
  topicId: string;
  topicTitle: string;
  body: string;
  upvotes: number;
  createdAt: string;
}

export function getCommentsByUser(_userId: string): UserComment[] {
  return [];
}

export function getComments(_topicId: string): Comment[] {
  return [];
}
