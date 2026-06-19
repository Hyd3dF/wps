"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { VoteBar } from "@/components/ui/VoteBar";
import { SaveButton } from "@/components/ui/SaveButton";
import { CategoryBadge, TagList, PinBadge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { stripMarkdown } from "@/components/ui/Markdown";
import { timeAgo, formatNumber, cn } from "@/lib/utils";
import type { Topic } from "@/types";

export function TopicCard({ topic, className }: { topic: Topic; className?: string }) {
  const toggleSave = async (next: boolean) => {
    const response = await fetch(`/api/backend/topics/${encodeURIComponent(topic.id)}/save`, {
      method: next ? "POST" : "DELETE",
    });
    if (!response.ok) throw new Error("Kaydetme işlemi başarısız");
  };

  return (
    <article
      className={cn(
        "card group transition-colors hover:border-text-secondary/30",
        className,
      )}
    >
      <div className="flex gap-4">
        <div className="hidden sm:block">
          <VoteBar
            upvotes={topic.upvotes}
            downvotes={topic.downvotes}
            myVote={topic.myVote}
            targetType="topic"
            targetId={topic.id}
            variant="vertical"
            size="sm"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2 text-xs text-text-secondary">
            <Avatar user={topic.author} size={24} href={`/u/${topic.author.username}`} />
            <Link
              href={`/u/${topic.author.username}`}
              className="font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              {topic.author.displayName}
            </Link>
            <span>·</span>
            <time dateTime={topic.createdAt}>{timeAgo(topic.createdAt)}</time>
            {topic.isPinned && <PinBadge />}
            <div className="ml-auto">
              <SaveButton saved={topic.isSaved} onToggle={toggleSave} size={16} />
            </div>
          </div>

          <Link href={`/topics/${topic.id}`} className="block">
            <h3 className="text-lg font-display font-semibold leading-snug text-text-primary transition-colors group-hover:text-accent">
              {topic.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-secondary">
              {stripMarkdown(topic.body, 220)}
            </p>
          </Link>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <CategoryBadge category={topic.category} />
            <TagList tags={topic.tags.slice(0, 4)} />
          </div>

          <div className="mt-3 flex items-center gap-4 text-xs text-text-secondary">
            <span className="sm:hidden inline-flex items-center gap-1">
              <Icon name="arrow-up" size={14} />
              {formatNumber(topic.upvotes - topic.downvotes)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Icon name="chat" size={14} />
              {formatNumber(topic.commentCount)} yorum
            </span>
            <span className="inline-flex items-center gap-1">
              <Icon name="eye" size={14} />
              {formatNumber(topic.viewCount)} görüntülenme
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export function TopicCardList({ topics, className }: { topics: Topic[]; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {topics.map((t) => (
        <TopicCard key={t.id} topic={t} />
      ))}
    </div>
  );
}
