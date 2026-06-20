"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ContributionGraph } from "@/components/user/ContributionGraph";
import { Tabs } from "@/components/ui/Tabs";
import { TopicCardList } from "@/components/topic/TopicCard";
import { Markdown, stripMarkdown } from "@/components/ui/Markdown";
import { EmptyState } from "@/components/ui/EmptyState";
import { useApp } from "@/components/providers/AppProvider";
import { useI18n } from "@/components/providers/I18nProvider";
import { formatNumber, timeAgo, formatDate, cn } from "@/lib/utils";
import type { User, Topic, UserComment } from "@/types";
import { toTopic } from "@/lib/backend-content";

export function ProfileView({ user }: { user: User }) {
  const { t, locale } = useI18n();
  const { user: me } = useApp();
  const [following, setFollowing] = useState(user.isFollowing || false);
  const isMe = me?.username === user.username;

  useEffect(() => {
    setFollowing(user.isFollowing || false);
  }, [user.isFollowing]);

  const handleFollowToggle = async () => {
    if (!me) return;
    const isCurrentlyFollowing = following;
    setFollowing(!isCurrentlyFollowing);
    try {
      const response = await fetch(`/api/backend/users/${encodeURIComponent(user.username)}/follow`, {
        method: isCurrentlyFollowing ? "DELETE" : "POST",
      });
      if (!response.ok) {
        throw new Error(t("profile.followError"));
      }
    } catch (err) {
      console.error(err);
      setFollowing(isCurrentlyFollowing);
    }
  };

  const [userTopics, setUserTopics] = useState<Topic[]>([]);
  const [userComments, setUserComments] = useState<UserComment[]>([]);
  const [saved, setSaved] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [topicsRes, commentsRes] = await Promise.all([
          fetch(`/api/backend/users/${encodeURIComponent(user.username)}/topics`).then((r) => r.json()),
          fetch(`/api/backend/users/${encodeURIComponent(user.username)}/comments`).then((r) => r.json()),
        ]);
        if (!active) return;

        let savedTopics: Topic[] = [];
        if (isMe) {
          const savedRes = await fetch("/api/backend/topics/saved").then((r) => r.json());
          if (savedRes?.topics) {
            savedTopics = savedRes.topics.map(toTopic);
          }
        }

        if (active) {
          setUserTopics((topicsRes?.topics || []).map(toTopic));
          setUserComments(commentsRes?.comments || []);
          if (isMe) {
            setSaved(savedTopics);
          }
        }
      } catch (err) {
        console.error(t("profile.loadError"), err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => {
      active = false;
    };
  }, [user.username, isMe, t]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="card overflow-hidden p-0 bg-transparent border-0">
        <div className="px-6 pb-6 pt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-5">
            <Avatar
              user={user}
              size={88}
              className="rounded-full ring-4 ring-bg-secondary"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-display font-bold tracking-tight text-text-primary">
                {user.displayName}
              </h1>
              <p className="text-sm text-text-secondary">@{user.username}</p>
            </div>
            <div className="flex gap-2">
              {isMe ? (
                <Link href="/settings" className="btn-secondary">
                  <Icon name="settings" size={16} />
                  {t("profile.editProfile")}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleFollowToggle}
                  className={following ? "btn-secondary" : "btn-primary"}
                >
                  <Icon name={following ? "check" : "plus"} size={16} />
                  {following ? t("profile.following") : t("profile.follow")}
                </button>
              )}
            </div>
          </div>

          {user.bio && (
            <p className="mt-4 text-sm leading-relaxed text-text-primary">{user.bio}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-secondary">
            {user.websiteUrl && (
              <SocialLink href={user.websiteUrl} icon="link" label="Website" />
            )}
            {user.githubUrl && (
              <SocialLink href={user.githubUrl} icon="github" label="GitHub" />
            )}
            {user.twitterUrl && (
              <SocialLink href={user.twitterUrl} icon="twitter" label="Twitter" />
            )}
            <span className="inline-flex items-center gap-1">
              <Icon name="clock" size={15} />
              {t("profile.joinedAt", { date: formatDate(user.joinedAt, locale) })}
            </span>
          </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatBox value={formatNumber(user.reputation)} label={t("profile.statReputation")} icon="star" />
            <StatBox value={formatNumber(user.topicCount)} label={t("profile.statTopics")} icon="chat" />
            <StatBox value={formatNumber(user.followersCount)} label={t("profile.statFollowers")} icon="users" />
            <StatBox value={formatNumber(user.followingCount)} label={t("profile.statFollowing")} icon="user" />
          </div>

          <div className="mt-8">
            <ContributionGraph username={user.username} />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Tabs
          items={[
            {
              id: "topics",
              label: t("profile.tabTopics"),
              count: userTopics.length,
              content: loading ? (
                <div className="py-8 text-center text-text-secondary">{t("common.loading")}</div>
              ) : userTopics.length > 0 ? (
                <TopicCardList topics={userTopics} />
              ) : (
                <EmptyState icon="chat" title={t("profile.noTopics")} description={t("profile.noTopicsDesc", { name: user.displayName })} />
              ),
            },
            {
              id: "comments",
              label: t("profile.tabComments"),
              count: userComments.length,
              content: loading ? (
                <div className="py-8 text-center text-text-secondary">{t("common.loading")}</div>
              ) : userComments.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {userComments.map((c) => (
                    <Link
                      key={c.id}
                      href={`/topics/${c.topicId}#${c.id}`}
                      className="card transition-colors hover:border-text-secondary/30"
                    >
                      <p className="mb-1 text-xs text-text-secondary">
                        <Icon name="reply" size={12} className="mr-1 inline" />
                        {c.topicTitle}
                      </p>
                      <p className="line-clamp-2 text-sm text-text-primary">{stripMarkdown(c.body, 180)}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-text-secondary">
                        <span className="inline-flex items-center gap-1">
                          <Icon name="arrow-up" size={13} />
                          {formatNumber(c.upvotes)}
                        </span>
                        <time>{timeAgo(c.createdAt, locale)}</time>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState icon="chat" title={t("profile.noComments")} />
              ),
            },
            ...(isMe
              ? [
                  {
                    id: "saved",
                    label: t("profile.tabSaved"),
                    count: saved.length,
                    content: loading ? (
                      <div className="py-8 text-center text-text-secondary">{t("common.loading")}</div>
                    ) : saved.length > 0 ? (
                      <TopicCardList topics={saved} />
                    ) : (
                      <EmptyState
                        icon="bookmark"
                        title={t("profile.noSaved")}
                        description={t("profile.noSavedDesc")}
                        action={
                          <Link href="/explore" className="btn-primary">
                            <Icon name="explore" size={16} />
                            {t("common.explore")}
                          </Link>
                        }
                      />
                    ),
                  },
                ]
              : []),
          ]}
        />
      </div>
    </div>
  );
}

function StatBox({ value, label, icon }: { value: string; label: string; icon: IconName }) {
  return (
    <div className="rounded-btn border border-border bg-bg-tertiary/40 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-xs text-text-secondary">
        <Icon name={icon} size={14} />
        {label}
      </div>
      <p className="mt-0.5 text-lg font-display font-bold tabular-nums text-text-primary">
        {value}
      </p>
    </div>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: IconName; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 transition-colors hover:text-accent"
    >
      <Icon name={icon} size={15} />
      {label}
    </a>
  );
}
