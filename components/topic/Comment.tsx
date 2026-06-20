"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { VoteBar } from "@/components/ui/VoteBar";
import { Markdown, stripMarkdown } from "@/components/ui/Markdown";
import { Icon } from "@/components/ui/Icon";
import { timeAgo, cn } from "@/lib/utils";
import { useI18n } from "@/components/providers/I18nProvider";
import type { Comment } from "@/types";

const MAX_DEPTH = 3;

export function CommentItem({ comment }: { comment: Comment }) {
  const { t, locale } = useI18n();
  const [showReply, setShowReply] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const canNest = comment.depth < MAX_DEPTH - 1;

  return (
    <div className={cn(comment.depth > 0 && "mt-4")}>
      <div className="flex gap-3">
        <Avatar user={comment.author} size={28} href={`/u/${comment.author.username}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[13px] text-text-secondary">
            <Link
              href={`/u/${comment.author.username}`}
              className="font-semibold text-text-primary transition-colors hover:text-accent"
            >
              {comment.author.displayName}
            </Link>
            <span>·</span>
            <time dateTime={comment.createdAt}>{timeAgo(comment.createdAt, locale)}</time>
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className="h-5 w-5 inline-flex items-center justify-center rounded hover:bg-bg-tertiary text-text-secondary transition-colors"
              aria-label={collapsed ? t("comment.expand") : t("comment.collapse")}
            >
              <Icon name={collapsed ? "chevron-right" : "chevron-down"} size={14} />
            </button>
          </div>

          {!collapsed && (
            <>
              <div className="mt-1 text-[14px] leading-relaxed text-text-primary">
                <Markdown>{comment.body}</Markdown>
              </div>

              <div className="mt-1.5 flex items-center gap-3">
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
                    className="inline-flex items-center gap-1.5 text-[12px] font-medium text-text-secondary transition-colors hover:text-white"
                  >
                    <Icon name="reply" size={14} />
                    {t("comment.reply")}
                  </button>
                )}
              </div>

              {showReply && (
                <div className="mt-3 animate-fade-in">
                  <CommentComposer
                    topicId={comment.topicId}
                    parentId={comment.id}
                    placeholder={t("comment.replyPlaceholder", { name: comment.author.username })}
                    onCancel={() => setShowReply(false)}
                  />
                </div>
              )}

              {comment.children.length > 0 && (
                <div className="mt-3 border-l-2 border-border/50 pl-4">
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
  const { t, locale } = useI18n();
  if (comments.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-text-secondary">
        {t("comment.none")}
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-5">
      {comments.map((c) => (
        <CommentItem key={c.id} comment={c} />
      ))}
    </div>
  );
}

export function CommentComposer({
  topicId,
  parentId,
  placeholder,
  onCancel,
  autoFocus,
}: {
  topicId: string;
  parentId?: string;
  placeholder?: string;
  onCancel?: () => void;
  autoFocus?: boolean;
}) {
  const { t, locale } = useI18n();
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
      if (!response.ok) throw new Error(data?.error?.message || t("comment.sendError"));
      setBody("");
      setPreview(false);
      onCancel?.();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("comment.sendError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setPreview(false)}
          className={cn(
            "px-2 py-1 text-[13px] font-semibold transition-colors rounded",
            !preview ? "bg-bg-tertiary text-white" : "text-text-secondary hover:text-white hover:bg-bg-tertiary/50",
          )}
        >
          {t("common.write")}
        </button>
        <button
          type="button"
          onClick={() => setPreview(true)}
          className={cn(
            "px-2 py-1 text-[13px] font-semibold transition-colors rounded",
            preview ? "bg-bg-tertiary text-white" : "text-text-secondary hover:text-white hover:bg-bg-tertiary/50",
          )}
        >
          {t("common.preview")}
        </button>
      </div>
      {preview ? (
        <div className="min-h-[96px] rounded-md border border-border bg-transparent p-3 text-[14px]">
          {body.trim() ? (
            <Markdown>{body}</Markdown>
          ) : (
            <span className="text-text-secondary">{t("common.previewEmpty")}</span>
          )}
        </div>
      ) : (
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={placeholder ?? t("comment.composerPlaceholder")}
          autoFocus={autoFocus}
          className="w-full min-h-[96px] rounded-md border border-border bg-transparent px-3 py-2 text-[14px] text-white placeholder:text-text-secondary/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50 resize-y"
        />
      )}
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-text-secondary">
          {stripMarkdown(body).length} {t("common.characters")}
        </span>
        <div className="flex gap-2">
          {onCancel && (
            <button type="button" onClick={onCancel} className="px-3 py-1.5 text-[13px] font-semibold text-text-secondary hover:text-white transition-colors">
              {t("common.cancel")}
            </button>
          )}
          <button type="submit" disabled={!body.trim() || submitting} className="btn-primary py-1.5 px-4 text-[13px]">
            <Icon name="send" size={14} />
            {submitting ? t("common.sending") : t("common.send")}
          </button>
        </div>
      </div>
      {error && <p role="alert" className="text-[13px] text-danger">{error}</p>}
    </form>
  );
}
