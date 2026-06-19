"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  content: React.ReactNode;
}

export function Tabs({
  items,
  defaultId,
  className,
}: {
  items: TabItem[];
  defaultId?: string;
  className?: string;
}) {
  const [active, setActive] = useState(defaultId ?? items[0]?.id);
  const current = items.find((i) => i.id === active) ?? items[0];

  return (
    <div className={className}>
      <div className="flex gap-1 border-b border-border">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(item.id)}
            className={cn(
              "relative -mb-px px-4 py-2.5 text-sm font-medium transition-colors duration-150",
              active === item.id
                ? "text-text-primary"
                : "text-text-secondary hover:text-text-primary",
            )}
          >
            {item.label}
            {typeof item.count === "number" && (
              <span className="ml-1.5 rounded-badge bg-bg-tertiary px-1.5 py-0.5 text-xs tabular-nums text-text-secondary">
                {item.count}
              </span>
            )}
            {active === item.id && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-accent" />
            )}
          </button>
        ))}
      </div>
      <div className="pt-4">{current?.content}</div>
    </div>
  );
}
