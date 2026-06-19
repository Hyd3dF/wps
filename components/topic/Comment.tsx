"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { VoteBar } from "@/components/ui/VoteBar";
import { Markdown, stripMarkdown } from "@/components/ui/Markdown";
import { Icon } from "@/components/ui/Icon";
import { timeAgo, cn } from "@/lib/utils";
import type { Comment } from "@/types";

const MAX_DEPTH = 3;

export function CommentItem({ comment }: { comment: Comment }) {
  const [showReply, setShowReply] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const canNest = comment.depth < MAX_DEPTH - 1;

  return (
    <div className={cn(comment.depth > 0 && "mt-4")}>
      <div className="flex gap-3">
        <Avatar user={comment.author} size={32} href={`/u/${comment.author.username}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Link
              href={`/u/${comment.author.username}`}
              className="font-medium text-text-primary transition-colors hover:text-accent"
            >
              {comment.author.displayName}
            </Link>
            <span>·</span>
            <time dateTime={comment.createdAt}>{timeAgo(comment.createdAt)}</time>
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className="icon-btn h-6 w-6 text-text-secondary/70"
              aria-label={collapsed ? "Genişlet" : "Daralt"}
            >
              <Icon name={collapsed ? "chevron-right" : "chevron-down"} size={14} />
            </button>
          </div>

          {!collapsed && (
            <>
              <div className="mt-1.5 text-sm">
                <Markdown>{comment.body}</Markdown>
              </div>

              <div className="mt-2 flex items-center gap-3">
                <VoteBar
                  upvotes={comment.upvotes}
                  downvotes={comment.downvotes}
                  myVote={comment.myVote}
                  targetType="comment"
                  targetId={comment.id}
                  variant="horizontal"
                  size="sm"
                />
                {canNest && (
                  <button
                    type="button"
                    onClick={() => setShowReply((s) => !s)}
                    className="inline-flex items-center gap-1 text-xs text-text-secondary transition-colors hover:text-accent"
                  >
                    <Icon name="reply" size={14} />
                    Yanıtla
                  </button>
                )}
              </div>

              {showReply && (
                <div className="mt-3 animate-fade-in">
                  <CommentComposer
                    topicId={comment.topicId}
                    parentId={comment.id}
                    placeholder={`@${comment.author.username} yanıtın...`}
                    onCancel={() => setShowReply(false)}
                  />
                </div>
              )}

              {comment.children.length > 0 && (
                <div className="mt-4 border-l border-border pl-4">
                  {comment.children.map((child) => (
                    <CommentItem key={child.id} comment={child} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function CommentList({ comments }: { comments: Comment[] }) {
  if (comments.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-text-secondary">
        Henüz yorum yok. İlk yorumu sen yaz.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-6">
      {comments.map((c) => (
        <CommentItem key={c.id} comment={c} />
      ))}
    </div>
  );
}

export function CommentComposer({
  topicId,
  parentId,
  placeholder = "Yorumunu yaz... (Markdown destekli)",
  onCancel,
  autoFocus,
}: {
  topicId: string;
  parentId?: string;
  placeholder?: string;
  onCancel?: () => void;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [preview, setPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(`/api/backend/topics/${encodeURIComponent(topicId)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body.trim(), ...(parentId ? { parentId } : {}) }),
      });
      const data = await response.json().catch(() => null) as { error?: { message?: string } } | null;
      if (!response.ok) throw new Error(data?.error?.message || "Yorum gönderilemedi");
      setBody("");
      setPreview(false);
      onCancel?.();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yorum gönderilemedi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-card border border-border bg-bg-tertiary/40 p-3">
      <div className="mb-2 flex items-center gap-1">
        <button
          type="button"
          onClick={() => setPreview(false)}
          className={cn(
            "rounded-badge px-2 py-1 text-xs transition-colors",
            !preview ? "bg-bg-tertiary text-text-primary" : "text-text-secondary hover:text-text-primary",
          )}
        >
          Yaz
        </button>
        <button
          type="button"
          onClick={() => setPreview(true)}
          className={cn(
            "rounded-badge px-2 py-1 text-xs transition-colors",
            preview ? "bg-bg-tertiary text-text-primary" : "text-text-secondary hover:text-text-primary",
          )}
        >
          Önizle
        </button>
      </div>
      {preview ? (
        <div className="min-h-[96px] rounded-btn border border-border bg-bg-secondary p-3 text-sm">
          {body.trim() ? (
            <Markdown>{body}</Markdown>
          ) : (
            <span className="text-text-secondary">Önizleme boş</span>
          )}
        </div>
      ) : (
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="textarea min-h-[96px]"
        />
      )}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-text-secondary">
          {stripMarkdown(body).length} karakter
        </span>
        <div className="flex gap-2">
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-ghost">
              İptal
            </button>
          )}
          <button type="submit" disabled={!body.trim() || submitting} className="btn-primary">
            <Icon name="send" size={14} />
            {submitting ? "Gönderiliyor..." : "Gönder"}
          </button>
        </div>
      </div>
      {error && <p role="alert" className="mt-2 text-xs text-danger">{error}</p>}
    </form>
  );
}
