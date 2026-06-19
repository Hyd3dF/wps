import type { Category, Comment, Room, RoomMember, RoomMessage, Topic, User } from "@/types";

export interface BackendTopic {
  id: string;
  userId: string;
  authorUsername: string;
  authorDisplayName: string | null;
  authorAvatarUrl: string | null;
  title: string;
  body: string;
  category: Category;
  tags: string[];
  upvotes: number;
  downvotes: number;
  viewCount: number;
  commentCount: number;
  isPinned: boolean;
  myVote: 1 | -1 | 0;
  isSaved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendComment {
  id: string;
  topicId: string;
  parentId: string | null;
  userId: string;
  authorUsername: string;
  authorDisplayName: string | null;
  authorAvatarUrl: string | null;
  body: string;
  upvotes: number;
  downvotes: number;
  depth: number;
  myVote: 1 | -1 | 0;
  children: BackendComment[];
  createdAt: string;
}

export interface BackendRoom {
  id: string;
  ownerId: string;
  ownerUsername: string;
  name: string;
  description: string | null;
  slug: string;
  isPrivate: boolean;
  memberCount: number;
  isMember: boolean;
  createdAt: string;
}

export interface BackendRoomMessage {
  id: string;
  roomId: string;
  userId: string;
  authorUsername: string;
  authorDisplayName: string | null;
  authorAvatarUrl: string | null;
  type: "text" | "image" | "file";
  content: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  createdAt: string;
}

export interface BackendRoomMember {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: "owner" | "admin" | "member";
  joinedAt: string;
}

function compactUser(id: string, username: string, displayName: string | null, avatarUrl: string | null, joinedAt: string): User {
  return {
    id,
    username,
    email: "",
    displayName: displayName || username,
    bio: "",
    avatarUrl,
    websiteUrl: null,
    githubUrl: null,
    twitterUrl: null,
    reputation: 0,
    topicCount: 0,
    commentCount: 0,
    followersCount: 0,
    followingCount: 0,
    joinedAt,
  };
}

export function toTopic(topic: BackendTopic): Topic {
  return {
    ...topic,
    author: compactUser(topic.userId, topic.authorUsername, topic.authorDisplayName, topic.authorAvatarUrl, topic.createdAt),
  };
}

export function toComment(comment: BackendComment): Comment {
  return {
    ...comment,
    author: compactUser(comment.userId, comment.authorUsername, comment.authorDisplayName, comment.authorAvatarUrl, comment.createdAt),
    children: comment.children.map(toComment),
  };
}

export function toRoom(room: BackendRoom): Room {
  return {
    ...room,
    description: room.description || "",
    owner: compactUser(room.ownerId, room.ownerUsername, room.ownerUsername, null, room.createdAt),
    onlineCount: 0,
    lastMessage: null,
  };
}

export function toRoomMessage(message: BackendRoomMessage): RoomMessage {
  return {
    ...message,
    content: message.content || "",
    author: compactUser(message.userId, message.authorUsername, message.authorDisplayName, message.authorAvatarUrl, message.createdAt),
  };
}

export function toRoomMember(member: BackendRoomMember): RoomMember {
  return {
    ...member,
    user: compactUser(member.userId, member.username, member.displayName, member.avatarUrl, member.joinedAt),
    isOnline: false,
  };
}
