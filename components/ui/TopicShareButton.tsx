"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/providers/I18nProvider";

export function TopicShareButton({
  title,
  topicUrl,
  className,
}: {
  title: string;
  topicUrl?: string;
  className?: string;
}) {
  const { t, locale } = useI18n();
  const [copied, setCopied] = useState(false);

  const url = topicUrl ?? (typeof window !== "undefined" ? window.location.href : "");
  const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const shareX = () => {
    const w = 640;
    const h = 480;
    const x = (screen.width - w) / 2;
    const y = (screen.height - h) / 2;
    window.open(xUrl, "share-x", `width=${w},height=${h},left=${x},top=${y},noopener,noreferrer`);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={shareX}
        className="inline-flex items-center gap-1.5 rounded-btn px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
        aria-label={t("common.shareOnX")}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        X
      </button>
      <button
        type="button"
        onClick={copyLink}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-btn px-3 py-1.5 text-sm transition-colors",
          copied
            ? "bg-success/15 text-success"
            : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary",
        )}
        aria-label={t("common.copyLink")}
      >
        <Icon name={copied ? "check" : "link"} size={15} />
        {copied ? t("common.copied") : t("common.copyLink")}
      </button>
    </div>
  );
}
