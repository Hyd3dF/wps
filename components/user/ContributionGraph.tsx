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
  const { t, locale } = useI18n();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const years = [currentYear, currentYear - 1, currentYear - 2];

  useEffect(() => {
    let active = true;
    const fetchContributions = async () => {
      try {
        setLoading(true);
        const url = `/api/backend/users/${encodeURIComponent(username)}/contributions?year=${selectedYear}`;
        const res = await fetch(url);
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
    return () => {
      active = false;
    };
  }, [username, selectedYear]);

  if (loading) {
    return (
      <div className="card animate-pulse flex h-[180px] items-center justify-center border border-border">
        <span className="text-sm text-text-secondary">Loading activity...</span>
      </div>
    );
  }

  // Transform into weeks to display as a grid
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

  // Calculate month labels for each week
  const monthLabels: { text: string; colSpan: number }[] = [];
  let currentMonth = "";
  let monthWeeksCount = 0;

  weeks.forEach((week) => {
    const firstValidDay = week.find((day) => day.date !== "");
    if (firstValidDay) {
      const date = new Date(firstValidDay.date);
      const monthName = date.toLocaleString(locale === "tr" ? "tr-TR" : "en-US", { month: "short" });
      if (monthName !== currentMonth) {
        if (monthWeeksCount > 0) {
          monthLabels.push({ text: currentMonth, colSpan: monthWeeksCount });
        }
        currentMonth = monthName;
        monthWeeksCount = 1;
      } else {
        monthWeeksCount++;
      }
    } else {
      if (monthWeeksCount > 0) {
        monthWeeksCount++;
      }
    }
  });
  if (monthWeeksCount > 0 && currentMonth) {
    monthLabels.push({ text: currentMonth, colSpan: monthWeeksCount });
  }

  const dayLabels = locale === "tr" 
    ? ["", "Pzt", "", "Çar", "", "Cum", ""] 
    : ["", "Mon", "", "Wed", "", "Fri", ""];

  return (
    <div className="card flex flex-col md:flex-row gap-6 rounded-lg border border-border bg-bg-secondary p-5 shadow-sm">
      {/* Calendar Area */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-text-primary">
            {total} {locale === "tr" ? "katkı" : "contributions"} {selectedYear === currentYear ? (locale === "tr" ? "son 1 yılda" : "in the last year") : (locale === "tr" ? `${selectedYear} yılında` : `in ${selectedYear}`)}
          </h2>
          <span className="text-[11px] text-text-secondary/70">
            {locale === "tr" ? "Aktiviteler senkronize ediliyor" : "Activity synced globally"}
          </span>
        </div>

        {/* Scrollable Container for Grid */}
        <div className="overflow-x-auto pb-2 custom-scrollbar">
          <div className="min-w-max">
            {/* Months row */}
            <div className="flex gap-[3px] text-[10px] text-text-secondary/40 font-mono mb-1 select-none pl-[32px]">
              {monthLabels.map((ml, idx) => (
                <div key={idx} style={{ width: `${ml.colSpan * 13}px` }} className="text-left truncate">
                  {ml.text}
                </div>
              ))}
            </div>

            {/* Grid with Day Labels */}
            <div className="flex gap-[3px]">
              {/* Day Labels */}
              <div className="flex flex-col gap-[3px] pr-2 text-[9px] text-text-secondary/40 font-mono select-none h-fit pt-[1px] w-[24px] text-right">
                {dayLabels.map((label, idx) => (
                  <div key={idx} className="h-[10px] flex items-center justify-end">
                    {label}
                  </div>
                ))}
              </div>

              {/* Weeks */}
              <div className="flex gap-[3px]">
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
                            "h-[10px] w-[10px] rounded-[2px] transition-all cursor-pointer hover:ring-1 hover:ring-text-primary/50",
                            level === 0 ? "bg-white/[0.03] border border-white/[0.01]" : "",
                            level === 1 ? "bg-accent/20 border border-accent/10 opacity-70 hover:opacity-100 hover:scale-110" : "",
                            level === 2 ? "bg-accent/50 border border-accent/30 shadow-[0_0_6px_rgba(108,99,255,0.25)] hover:scale-110" : "",
                            level === 3 ? "bg-accent/75 border border-accent/40 shadow-[0_0_10px_rgba(108,99,255,0.45)] hover:scale-110" : "",
                            level === 4 ? "bg-accent border border-accent shadow-[0_0_16px_rgba(108,99,255,0.8)] hover:scale-110 hover:brightness-110" : "",
                          )}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-1.5 text-[11px] text-text-secondary pr-2">
          <span>Less</span>
          <div className="flex gap-[3px]">
            <div className="h-[10px] w-[10px] rounded-[2px] bg-white/[0.03] border border-white/[0.01]" />
            <div className="h-[10px] w-[10px] rounded-[2px] bg-accent/20 border border-accent/10" />
            <div className="h-[10px] w-[10px] rounded-[2px] bg-accent/50 border border-accent/30" />
            <div className="h-[10px] w-[10px] rounded-[2px] bg-accent/75 border border-accent/40" />
            <div className="h-[10px] w-[10px] rounded-[2px] bg-accent border border-accent" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Years Sidebar */}
      <div className="flex md:flex-col gap-2 md:border-l border-white/[0.06] md:pl-6 pt-2 md:pt-0">
        {years.map((y) => (
          <button
            key={y}
            onClick={() => setSelectedYear(y)}
            className={cn(
              "px-3 py-1 text-xs font-semibold rounded transition-all text-left",
              selectedYear === y
                ? "bg-accent text-white font-bold shadow-sm shadow-accent/15"
                : "text-text-secondary hover:text-white hover:bg-white/[0.04]",
            )}
          >
            {y}
          </button>
        ))}
      </div>
    </div>
  );
}
