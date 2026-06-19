"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

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
        if (!response.ok) throw new Error("Kaydetme işlemi başarısız");
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
      aria-label={isSaved ? "Kaydı kaldır" : "Kaydet"}
      title={isSaved ? "Kaydedildi" : "Kaydet"}
    >
      <Icon
        name={isSaved ? "bookmark-filled" : "bookmark"}
        size={size}
        fill={isSaved ? "currentColor" : "none"}
      />
    </button>
  );
}
