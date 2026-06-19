"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export function ShareButton({
  className,
  label = "Paylaş",
}: {
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-btn px-3 py-1.5 text-sm transition-colors",
        copied
          ? "bg-success/15 text-success"
          : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary",
        className,
      )}
    >
      <Icon name={copied ? "check" : "share"} size={15} />
      {copied ? "Kopyalandı" : label}
    </button>
  );
}
