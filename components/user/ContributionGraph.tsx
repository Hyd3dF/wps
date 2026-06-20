"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/components/providers/I18nProvider";
import { cn } from "@/lib/utils";

interface Contribution {
  date: string;
  count: number;
}

function getIntensityLevel(count: number) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 8) return 3;
  return 4;
}

export function ContributionGraph({ username }: { username: string }) {
  const { t } = useI18n();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchContributions = async () => {
      try {
        const res = await fetch(`/api/backend/users/${encodeURIComponent(username)}/contributions`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (active) {
          setContributions(data.contributions || []);
          setTotal(data.totalContributions || 0);
          setLoading(false);
        }
      } catch (e) {
        if (active) setLoading(false);
      }
    };
    fetchContributions();
    return () => { active = false; };
  }, [username]);

  if (loading) {
    return (
      <div className="card animate-pulse flex h-[160px] items-center justify-center border border-border">
        <span className="text-sm text-text-secondary">Loading activity...</span>
      </div>
    );
  }

  // Transform into weeks to display as a grid
  // A week array will hold 7 days
  const weeks: Contribution[][] = [];
  let currentWeek: Contribution[] = [];
  
  // Pad the first week to align the first day to its actual day of week
  if (contributions.length > 0) {
    const firstDate = new Date(contributions[0].date);
    const dayOfWeek = firstDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    for (let i = 0; i < dayOfWeek; i++) {
      currentWeek.push({ date: "", count: -1 }); // Padding
    }
  }

  contributions.forEach((c) => {
    currentWeek.push(c);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    // Pad the end
    while (currentWeek.length < 7) {
      currentWeek.push({ date: "", count: -1 });
    }
    weeks.push(currentWeek);
  }

  return (
    <div className="card flex flex-col gap-3 rounded-lg border border-border bg-bg-secondary p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-semibold text-text-primary">
          {total} contributions in the last year
        </h2>
        <span className="text-[11px] text-text-secondary/70">
          Activity synced globally
        </span>
      </div>

      <div className="overflow-x-auto pb-2 custom-scrollbar">
        <div className="flex gap-[3px] min-w-max">
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col gap-[3px]">
              {week.map((day, dIndex) => {
                if (day.count === -1) {
                  return <div key={`pad-${wIndex}-${dIndex}`} className="h-[10px] w-[10px] rounded-sm bg-transparent" />;
                }
                const level = getIntensityLevel(day.count);
                return (
                  <div
                    key={day.date}
                    title={`${day.count} contributions on ${day.date}`}
                    className={cn(
                      "h-[10px] w-[10px] rounded-[2px] transition-colors hover:ring-1 hover:ring-text-primary/50 cursor-pointer",
                      level === 0 ? "bg-bg-tertiary/50" : "",
                      level === 1 ? "bg-accent/30" : "",
                      level === 2 ? "bg-accent/60" : "",
                      level === 3 ? "bg-accent/90" : "",
                      level === 4 ? "bg-accent" : "",
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-1.5 text-[11px] text-text-secondary">
        <span>Less</span>
        <div className="flex gap-[3px]">
          <div className="h-[10px] w-[10px] rounded-[2px] bg-bg-tertiary/50" />
          <div className="h-[10px] w-[10px] rounded-[2px] bg-accent/30" />
          <div className="h-[10px] w-[10px] rounded-[2px] bg-accent/60" />
          <div className="h-[10px] w-[10px] rounded-[2px] bg-accent/90" />
          <div className="h-[10px] w-[10px] rounded-[2px] bg-accent" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
