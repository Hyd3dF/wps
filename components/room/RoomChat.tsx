"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { OnlineDot } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { timeAgo, formatNumber, cn } from "@/lib/utils";
import { useApp } from "@/components/providers/AppProvider";
import type { Room, RoomMessage, RoomMember } from "@/types";
import {
  toRoomMember,
  toRoomMessage,
  type BackendRoom,
  type BackendRoomMember,
  type BackendRoomMessage,
} from "@/lib/backend-content";

export function RoomChat({
  room,
  initialMessages,
  members: initialMembers,
}: {
  room: Room;
  initialMessages: RoomMessage[];
  members: RoomMember[];
}) {
  const { user } = useApp();
  const [messages, setMessages] = useState(initialMessages);
  const [members, setMembers] = useState(initialMembers);
  const [text, setText] = useState("");
  const [showMembers, setShowMembers] = useState(true);
  const [isMember, setIsMember] = useState(room.isMember);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const loadRoom = useCallback(async () => {
    const [roomResponse, memberResponse] = await Promise.all([
      fetch(`/api/backend/rooms/${encodeURIComponent(room.slug)}`, { cache: "no-store" }),
      fetch(`/api/backend/rooms/${encodeURIComponent(room.slug)}/members`, { cache: "no-store" }),
    ]);
    if (roomResponse.ok) {
      const data = await roomResponse.json() as { room: BackendRoom };
      setIsMember(data.room.isMember);
      if (data.room.isMember) {
        const messageResponse = await fetch(`/api/backend/rooms/${encodeURIComponent(room.slug)}/messages?limit=100`, { cache: "no-store" });
        if (messageResponse.ok) {
          const messageData = await messageResponse.json() as { messages: BackendRoomMessage[] };
          setMessages(messageData.messages.map(toRoomMessage));
        }
      }
    }
    if (memberResponse.ok) {
      const data = await memberResponse.json() as { members: BackendRoomMember[] };
      setMembers(data.members.map(toRoomMember));
    }
  }, [room.slug]);

  useEffect(() => {
    const initial = window.setTimeout(() => void loadRoom().catch(() => setError("Oda bilgileri alınamadı")), 0);
    const timer = window.setInterval(() => void loadRoom().catch(() => undefined), 5_000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, [loadRoom]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setShowMembers(false);
    }
  }, []);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user) return;
    setSending(true);
    setError("");
    try {
      const response = await fetch(`/api/backend/rooms/${encodeURIComponent(room.slug)}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text.trim() }),
      });
      const data = await response.json().catch(() => null) as
        | { message?: BackendRoomMessage; error?: { message?: string } }
        | null;
      if (!response.ok || !data?.message) throw new Error(data?.error?.message || "Mesaj gönderilemedi");
      setMessages((current) => [...current, toRoomMessage(data.message!)]);
      setText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mesaj gönderilemedi");
    } finally {
      setSending(false);
    }
  };

  const join = async () => {
    const response = await fetch(`/api/backend/rooms/${encodeURIComponent(room.slug)}/join`, { method: "POST" });
    if (!response.ok) {
      const data = await response.json().catch(() => null) as { error?: { message?: string } } | null;
      setError(data?.error?.message || "Odaya katılınamadı");
      return;
    }
    setIsMember(true);
    await loadRoom();
  };

  const sendImage = async (file: File) => {
    setSending(true);
    setError("");
    try {
      const form = new FormData();
      form.set("file", file);
      const response = await fetch(`/api/backend/rooms/${encodeURIComponent(room.slug)}/messages`, {
        method: "POST",
        body: form,
      });
      const data = await response.json().catch(() => null) as
        | { message?: BackendRoomMessage; error?: { message?: string } }
        | null;
      if (!response.ok || !data?.message) throw new Error(data?.error?.message || "Fotoğraf gönderilemedi");
      setMessages((current) => [...current, toRoomMessage(data.message!)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fotoğraf gönderilemedi");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col overflow-hidden rounded-card border border-border bg-bg-secondary lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-btn bg-accent/15 text-accent">
            <Icon name="hash" size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="truncate font-display font-semibold text-text-primary">
                {room.name}
              </h1>
              {room.isPrivate && (
                <Icon name="lock" size={14} className="text-warning" />
              )}
            </div>
            <p className="truncate text-xs text-text-secondary">
              <OnlineDot online={room.onlineCount > 0} />
              <span className="ml-1.5">
                {formatNumber(room.onlineCount)} çevrimiçi · {formatNumber(room.memberCount)} üye
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowMembers((s) => !s)}
            className={cn(
              "btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-btn transition-colors",
              showMembers ? "bg-bg-tertiary text-text-primary" : "text-text-secondary"
            )}
            title="Üye listesini aç/kapat"
          >
            <Icon name="users" size={14} />
            <span className="hidden sm:inline">Üyeler</span>
            <span className="tabular-nums bg-bg-primary px-1.5 py-0.5 rounded text-[10px]">{members.length}</span>
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto scrollbar-thin px-4 py-5"
        >
          {messages.map((m, i) => {
            const prev = messages[i - 1];
            const grouped = prev && prev.userId === m.userId &&
              new Date(m.createdAt).getTime() - new Date(prev.createdAt).getTime() < 5 * 60 * 1000;
            return (
              <MessageBubble key={m.id} message={m} grouped={!!grouped} currentUserId={user?.id} />
            );
          })}
          {messages.length === 0 && (
            <p className="py-10 text-center text-sm text-text-secondary">
              Henüz mesaj yok. İlk mesajı sen at.
            </p>
          )}
        </div>

        {error && <p role="alert" className="border-t border-border px-3 py-2 text-xs text-danger">{error}</p>}
        {!isMember ? (
          <div className="border-t border-border p-3">
            <button type="button" onClick={() => void join()} className="btn-primary w-full">Odaya Katıl</button>
          </div>
        ) : <form onSubmit={send} className="flex items-center gap-2 border-t border-border p-3">
          <button type="button" className="icon-btn" aria-label="Dosya ekle">
            <Icon name="paperclip" size={18} />
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void sendImage(file);
              event.target.value = "";
            }}
          />
          <button type="button" onClick={() => imageInputRef.current?.click()} className="icon-btn" aria-label="Resim ekle">
            <Icon name="image" size={18} />
          </button>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Mesaj yaz..."
            className="input"
          />
          <button type="submit" disabled={!text.trim() || sending} className="btn-primary px-3">
            <Icon name="send" size={16} />
            <span className="sr-only">Gönder</span>
          </button>
        </form>}
      </div>

      <aside
        className={cn(
          "h-[250px] w-full shrink-0 border-t border-border lg:h-full lg:w-64 lg:border-l lg:border-t-0",
          showMembers ? "block" : "hidden",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-border px-4 py-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <Icon name="users" size={16} className="text-text-secondary" />
              Üyeler
              <span className="ml-auto text-xs font-normal text-text-secondary">
                {members.length}
              </span>
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
            {members.map((m) => (
              <div
                key={m.userId}
                className="flex items-center gap-2.5 rounded-btn px-2 py-2 transition-colors hover:bg-bg-tertiary"
              >
                <div className="relative">
                  <Avatar user={m.user} size={32} href={`/u/${m.user.username}`} />
                  <span className="absolute -bottom-0.5 -right-0.5">
                    <OnlineDot online={m.isOnline} />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {m.user.displayName}
                  </p>
                  <p className="truncate text-xs text-text-secondary">
                    @{m.user.username}
                  </p>
                </div>
                {m.role !== "member" && (
                  <span
                    className={cn(
                      "badge",
                      m.role === "owner" ? "bg-accent/15 text-accent" : "bg-warning/15 text-warning",
                    )}
                  >
                    {m.role === "owner" ? "Sahip" : "Admin"}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="border-t border-border p-3">
            <button type="button" className="btn-secondary w-full">
              <Icon name="logout" size={16} />
              Odadan Ayrıl
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function MessageBubble({
  message,
  grouped,
  currentUserId,
}: {
  message: RoomMessage;
  grouped: boolean;
  currentUserId?: string;
}) {
  const isMe = currentUserId && message.userId === currentUserId;

  const renderFileContent = () => {
    return (
      <div className={cn(
        "inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm border",
        isMe
          ? "rounded-tr-sm border-accent/20 bg-accent/10 text-text-primary"
          : "rounded-tl-sm border-border bg-bg-tertiary text-text-primary"
      )}>
        <Icon name="paperclip" size={16} className="text-accent" />
        <a href={message.fileUrl || undefined} download className="font-medium hover:underline truncate max-w-[180px]">
          {message.fileName}
        </a>
        {message.fileSize && (
          <span className="text-xs text-text-secondary whitespace-nowrap">
            {formatNumber(Math.round(message.fileSize / 1024))} KB
          </span>
        )}
      </div>
    );
  };

  const renderImageContent = () => {
    return (
      <div className={cn(
        "overflow-hidden rounded-2xl border bg-bg-tertiary max-w-[280px] sm:max-w-md",
        isMe ? "rounded-tr-sm border-accent/20" : "rounded-tl-sm border-border"
      )}>
        <a href={message.fileUrl || undefined} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
          <img
            src={message.fileUrl || ""}
            alt={message.fileName || "Görsel"}
            className="max-h-60 max-w-full object-contain transition-transform hover:scale-[1.02]"
          />
        </a>
      </div>
    );
  };

  const renderTextContent = () => {
    return (
      <div className="text-sm leading-relaxed break-words text-text-primary py-0.5 px-1">
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    );
  };

  const renderContent = () => {
    if (message.type === "file") return renderFileContent();
    if (message.type === "image") return renderImageContent();
    return renderTextContent();
  };

  if (isMe) {
    return (
      <div className={cn("flex flex-col items-end", grouped ? "mt-0.5" : "mt-2")}>
        <div className="flex items-end justify-end gap-2 max-w-[85%]">
          <div className="flex flex-col items-end">
            {renderContent()}
            {!grouped && (
              <span className="text-[10px] text-text-secondary mt-1 px-1">
                {timeAgo(message.createdAt)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex justify-start gap-2.5", grouped ? "mt-0.5" : "mt-2")}>
      <div className="w-8 shrink-0 flex items-start justify-center">
        {!grouped ? (
          <Avatar user={message.author} size={32} href={`/u/${message.author.username}`} />
        ) : null}
      </div>
      <div className="flex flex-col items-start max-w-[85%]">
        {!grouped && (
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-xs font-semibold text-text-primary">
              {message.author.displayName}
            </span>
            <time className="text-[10px] text-text-secondary">
              {timeAgo(message.createdAt)}
            </time>
          </div>
        )}
        {renderContent()}
      </div>
    </div>
  );
}
