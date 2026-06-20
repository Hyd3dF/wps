"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TopicCardList } from "@/components/topic/TopicCard";
import { EmptyState, PageHeader } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import type { Topic } from "@/types";
import { toTopic } from "@/lib/backend-content";
import { useI18n } from "@/components/providers/I18nProvider";

export default function SavedPage() {
  const { t } = useI18n();
  const [saved, setSaved] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/backend/topics/saved")
      .then((r) => r.json())
      .then((data) => {
        if (active && data?.topics) {
          setSaved(data.topics.map(toTopic));
        }
      })
      .catch((err) => console.error(t("saved.loadError"), err))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [t]);

  return (
    <div className="mx-auto max-w-3xl relative">
      <PageHeader
        title={t("saved.title")}
        description={t("saved.subtitle")}
        action={
          <Link href="/explore" className="btn-secondary">
            <Icon name="explore" size={16} />
            {t("common.explore")}
          </Link>
        }
      />

      <div className="mt-8">
        {loading ? (
          <div className="py-20 text-center animate-pulse">
            <Icon name="bookmark" size={32} className="mx-auto mb-4 text-text-secondary/20" />
            <p className="text-[13px] font-medium text-text-secondary/60">{t("saved.loading")}</p>
          </div>
        ) : saved.length > 0 ? (
          <TopicCardList topics={saved} />
        ) : (
          <EmptyState
            icon="bookmark"
            title={t("saved.emptyTitle")}
            description={t("saved.emptyDesc")}
            action={
              <Link href="/explore" className="btn-primary">
                <Icon name="explore" size={16} />
                {t("saved.exploreCta")}
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
