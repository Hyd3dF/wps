"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/providers/I18nProvider";

export function SaveButton({
  saved,
  onToggle,
  resourceId,
  size = 18,
  className,
}: {
  saved: boolean;
  onToggle?: (next: boolean) => void | Promise<void>;
  resourceId?: string;
  size?: number;
  className?: string;
}) {
  const { t } = useI18n();
  const [isSaved, setIsSaved] = useState(saved);

  useEffect(() => {
    setIsSaved(saved);
  }, [saved]);
  const toggle = async () => {
    const next = !isSaved;
    setIsSaved(next);
    try {
      if (onToggle) {
        await onToggle(next);
      } else if (resourceId) {
        const response = await fetch(`/api/backend/topics/${encodeURIComponent(resourceId)}/save`, {
          method: next ? "POST" : "DELETE",
        });
        if (!response.ok) throw new Error(t("topic.saveError"));
      }
    } catch {
      setIsSaved(!next);
    }
  };
  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "icon-btn transition-colors",
        isSaved
          ? "text-warning hover:bg-warning/10"
          : "hover:text-warning",
        className,
      )}
      aria-pressed={isSaved}
      aria-label={isSaved ? t("topic.unsaveAria") : t("topic.saveAria")}
      title={isSaved ? t("topic.savedTitle") : t("topic.saveAria")}
    >
      <Icon
        name={isSaved ? "bookmark-filled" : "bookmark"}
        size={size}
        fill={isSaved ? "currentColor" : "none"}
      />
    </button>
  );
}
