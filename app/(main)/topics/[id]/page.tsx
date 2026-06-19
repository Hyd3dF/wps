import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { VoteBar } from "@/components/ui/VoteBar";
import { Markdown } from "@/components/ui/Markdown";
import { SaveButton } from "@/components/ui/SaveButton";
import { ShareButton } from "@/components/ui/ShareButton";
import { CategoryBadge, TagList, PinBadge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { CommentList, CommentComposer } from "@/components/topic/Comment";
import { formatDate, formatNumber, timeAgo } from "@/lib/utils";
import type { Metadata } from "next";
import { backendGet } from "@/lib/backend-server";
import { toComment, toTopic, type BackendComment, type BackendTopic } from "@/lib/backend-content";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const result = await backendGet<{ topic: BackendTopic }>(`topics/${encodeURIComponent(id)}`);
  const topic = result?.topic;
  if (!topic) return { title: "Konu bulunamadı" };
  const url = `/topics/${topic.id}`;
  const description = topic.body.slice(0, 160);
  return {
    title: topic.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: topic.title,
      description,
      publishedTime: topic.createdAt,
      modifiedTime: topic.updatedAt,
      authors: [`/u/${topic.authorUsername}`],
      images: topic.authorAvatarUrl ? [{ url: topic.authorAvatarUrl }] : undefined,
    },
  };
}

export default async function TopicDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [topicResult, commentResult] = await Promise.all([
    backendGet<{ topic: BackendTopic }>(`topics/${encodeURIComponent(id)}`),
    backendGet<{ comments: BackendComment[] }>(`topics/${encodeURIComponent(id)}/comments`),
  ]);
  if (!topicResult?.topic) notFound();
  const topic = toTopic(topicResult.topic);
  const comments = (commentResult?.comments ?? []).map(toComment);
  const author = topic.author;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    headline: topic.title,
    articleBody: topic.body,
    datePublished: topic.createdAt,
    dateModified: topic.updatedAt,
    url: `https://oroya.xyz/topics/${topic.id}`,
    author: {
      "@type": "Person",
      name: author.displayName,
      alternateName: `@${author.username}`,
      url: `https://oroya.xyz/u/${author.username}`,
      image: author.avatarUrl || undefined,
    },
    commentCount: topic.commentCount,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/LikeAction",
      userInteractionCount: topic.upvotes,
    },
    keywords: topic.tags.join(", "),
  };

  return (
    <div className="mx-auto max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <Link
        href="/explore"
        className="mb-4 inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        <Icon name="chevron-right" size={16} className="rotate-180" />
        Geri
      </Link>

      <article className="card">
        <div className="mb-4 flex items-center gap-2 text-xs text-text-secondary">
          {topic.isPinned && <PinBadge />}
          <CategoryBadge category={topic.category} />
        </div>

        <h1 className="text-3xl font-display font-extrabold leading-tight tracking-tight text-text-primary">
          {topic.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            href={`/u/${author.username}`}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Avatar user={author} size={36} />
            <div>
              <p className="text-sm font-medium text-text-primary">
                {author.displayName}
              </p>
              <p className="text-xs text-text-secondary">
                @{author.username} · {formatNumber(author.reputation)} itibar
              </p>
            </div>
          </Link>
          <span className="text-xs text-text-secondary">
            <time dateTime={topic.createdAt} title={formatDate(topic.createdAt)}>
              {timeAgo(topic.createdAt)} önce açıldı
            </time>
          </span>
        </div>

        <div className="mt-6 border-y border-border py-6">
          <Markdown>{topic.body}</Markdown>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <TagList tags={topic.tags} />
        </div>

        <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
          <VoteBar
            upvotes={topic.upvotes}
            downvotes={topic.downvotes}
            myVote={topic.myVote}
            targetType="topic"
            targetId={topic.id}
            variant="horizontal"
          />
          <SaveButton
            saved={topic.isSaved}
            className="ml-2"
            resourceId={topic.id}
          />
          <ShareButton />
          <div className="ml-auto flex items-center gap-4 text-xs text-text-secondary">
            <span className="inline-flex items-center gap-1">
              <Icon name="chat" size={14} />
              {formatNumber(topic.commentCount)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Icon name="eye" size={14} />
              {formatNumber(topic.viewCount)}
            </span>
          </div>
        </div>
      </article>

      <section className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold tracking-tight text-text-primary">
          <Icon name="chat" size={20} className="text-accent" />
          Yorumlar
          <span className="text-sm font-normal text-text-secondary">
            ({formatNumber(topic.commentCount)})
          </span>
        </h2>

        <CommentComposer topicId={topic.id} />

        <div className="mt-8">
          <CommentList comments={comments} />
        </div>
      </section>
    </div>
  );
}
