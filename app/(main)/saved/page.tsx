"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TopicCardList } from "@/components/topic/TopicCard";
import { EmptyState, PageHeader } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import type { Topic } from "@/types";
import { toTopic } from "@/lib/backend-content";

export default function SavedPage() {
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
      .catch((err) => console.error("Kaydedilenler yüklenemedi", err))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Kaydedilenler"
        description="Sonra okumak için kaydettiğin konular."
        action={
          <Link href="/explore" className="btn-secondary">
            <Icon name="explore" size={16} />
            Keşfet
          </Link>
        }
      />

      {loading ? (
        <div className="py-12 text-center text-text-secondary">Yükleniyor...</div>
      ) : saved.length > 0 ? (
        <TopicCardList topics={saved} />
      ) : (
        <EmptyState
          icon="bookmark"
          title="Henüz kayıt yok"
          description="Beğendiğin konuların yer imine ekle; burada kolayca ulaş."
          action={
            <Link href="/explore" className="btn-primary">
              <Icon name="explore" size={16} />
              Konuları keşfet
            </Link>
          }
        />
      )}
    </div>
  );
}
