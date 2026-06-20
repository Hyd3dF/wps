"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/providers/I18nProvider";

export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  const { t } = useI18n();

  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5", className)}
      aria-label={t("nav.logoAria")}
    >
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#1a1a1f] to-[#0c0c0e] border border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] transition-transform duration-300 group-hover:scale-105 group-hover:border-accent/40 group-hover:shadow-[0_0_15px_rgba(108,99,255,0.2)]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
        >
          <path
            d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
            stroke="url(#logo-gradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18"
            stroke="white"
            strokeOpacity="0.8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="logo-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8b85ff" />
              <stop offset="1" stopColor="#6c63ff" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {showText && (
        <span className="font-display text-[19px] font-extrabold tracking-tight text-white/95 transition-colors group-hover:text-white">
          Oroya
        </span>
      )}
    </Link>
  );
}
