"use client";

import { useState, useCallback, useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn, formatNumber } from "@/lib/utils";
import { useI18n } from "@/components/providers/I18nProvider";

interface VoteBarProps {
  upvotes: number;
  downvotes: number;
  myVote: 1 | -1 | 0;
  variant?: "vertical" | "horizontal";
  size?: "sm" | "md";
  targetType?: "topic" | "comment";
  targetId?: string;
}

export function VoteBar({
  upvotes,
  downvotes,
  myVote,
  variant = "vertical",
  size = "md",
  targetType,
  targetId,
}: VoteBarProps) {
  const { t } = useI18n();
  const [vote, setVote] = useState<1 | -1 | 0>(myVote);
  const [up, setUp] = useState(upvotes);
  const [down, setDown] = useState(downvotes);

  useEffect(() => {
    setVote(myVote);
  }, [myVote]);

  useEffect(() => {
    setUp(upvotes);
  }, [upvotes]);

  useEffect(() => {
    setDown(downvotes);
  }, [downvotes]);

  const handleVote = useCallback(
    async (value: 1 | -1) => {
      const previousVote = vote;
      const previousUp = up;
      const previousDown = down;

      let nextVote: 1 | -1 | 0 = 0;
      let nextUp = up;
      let nextDown = down;

      if (vote === value) {
        nextVote = 0;
        if (value === 1) {
          nextUp = up - 1;
        } else {
          nextDown = down - 1;
        }
      } else {
        nextVote = value;
        if (value === 1) {
          nextUp = up + 1;
          if (vote === -1) {
            nextDown = down - 1;
          }
        } else {
          nextDown = down + 1;
          if (vote === 1) {
            nextUp = up - 1;
          }
        }
      }

      setVote(nextVote);
      setUp(nextUp);
      setDown(nextDown);

      if (!targetType || !targetId) return;
      try {
        const base = targetType === "topic" ? "topics" : "comments";
        const response = await fetch(`/api/backend/${base}/${encodeURIComponent(targetId)}/vote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value }),
        });
        if (!response.ok) throw new Error(t("topic.voteError"));
      } catch {
        setVote(previousVote);
        setUp(previousUp);
        setDown(previousDown);
      }
    },
    [down, targetId, targetType, up, vote],
  );

  const score = up - down;
  const btnSize = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const iconSize = size === "sm" ? 15 : 18;

  if (variant === "horizontal") {
    return (
      <div className="inline-flex items-center gap-1">
        <button
          type="button"
          onClick={() => handleVote(1)}
          className={cn(
            "inline-flex items-center justify-center rounded-btn transition-colors",
            btnSize,
            vote === 1
              ? "bg-success/15 text-success"
              : "text-text-secondary hover:bg-bg-tertiary hover:text-success",
          )}
          aria-pressed={vote === 1}
          aria-label={t("common.upvote")}
        >
          <Icon name="arrow-up" size={iconSize} />
        </button>
        <span
          className={cn(
            "min-w-[2ch] text-center text-sm font-semibold tabular-nums",
            vote === 1 ? "text-success" : vote === -1 ? "text-danger" : "text-text-primary",
          )}
        >
          {formatNumber(score)}
        </span>
        <button
          type="button"
          onClick={() => handleVote(-1)}
          className={cn(
            "inline-flex items-center justify-center rounded-btn transition-colors",
            btnSize,
            vote === -1
              ? "bg-danger/15 text-danger"
              : "text-text-secondary hover:bg-bg-tertiary hover:text-danger",
          )}
          aria-pressed={vote === -1}
          aria-label={t("common.downvote")}
        >
          <Icon name="arrow-down" size={iconSize} />
        </button>
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={() => handleVote(1)}
        className={cn(
          "inline-flex items-center justify-center rounded-btn transition-colors",
          btnSize,
          vote === 1
            ? "bg-success/15 text-success"
            : "text-text-secondary hover:bg-bg-tertiary hover:text-success",
        )}
        aria-pressed={vote === 1}
        aria-label={t("common.upvote")}
      >
        <Icon name="arrow-up" size={iconSize} />
      </button>
      <span
        className={cn(
          "text-sm font-semibold tabular-nums",
          vote === 1 ? "text-success" : vote === -1 ? "text-danger" : "text-text-primary",
        )}
      >
        {formatNumber(score)}
      </span>
      <button
        type="button"
        onClick={() => handleVote(-1)}
        className={cn(
          "inline-flex items-center justify-center rounded-btn transition-colors",
          btnSize,
          vote === -1
            ? "bg-danger/15 text-danger"
            : "text-text-secondary hover:bg-bg-tertiary hover:text-danger",
        )}
        aria-pressed={vote === -1}
        aria-label={t("common.downvote")}
      >
        <Icon name="arrow-down" size={iconSize} />
      </button>
    </div>
  );
}
