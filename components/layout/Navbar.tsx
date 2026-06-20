"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import { useI18n } from "@/components/providers/I18nProvider";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { t } = useI18n();
  const { user, isAuthenticated, unreadCount, logout } = useApp();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setMobileOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg-primary">
      <div className="container-app flex h-16 items-center gap-4">
        <div className="flex items-center gap-2 lg:gap-0">
          <button
            type="button"
            className="icon-btn lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={t("nav.menu")}
          >
            <Icon name={mobileOpen ? "close" : "menu"} />
          </button>
          <Logo />
        </div>

        <form onSubmit={submitSearch} className="relative ml-4 hidden max-w-lg flex-1 sm:block">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/60">
            <Icon name="search" size={16} />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("nav.searchPlaceholder")}
            className="input pl-10 h-10 w-full rounded-full bg-white/[0.02] border-white/[0.04] text-sm focus:bg-white/[0.04] focus:border-accent/30"
          />
        </form>

        <div className="ml-auto flex items-center gap-1.5">
          {isAuthenticated && user ? (
            <>
              <Link
                href="/notifications"
                className="icon-btn relative hover:bg-white/[0.04] hover:text-white transition-all rounded-full h-10 w-10"
                aria-label={t("nav.notifications")}
              >
                <Icon name="bell" size={18} />
                {unreadCount > 0 && (
                  <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff5f56] px-1 text-[10px] font-bold text-white ring-2 ring-bg-primary">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
              <Link href="/new-topic" className="btn-primary hidden sm:inline-flex rounded-full h-10 px-5 text-[13px] tracking-wide">
                <Icon name="plus" size={16} />
                {t("nav.newTopic")}
              </Link>
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full p-1 pl-1.5 pr-3 transition-colors hover:bg-white/[0.04] border border-transparent hover:border-white/[0.05]"
                  aria-label={t("nav.accountMenu")}
                  aria-expanded={menuOpen}
                >
                  <Avatar user={user} size={32} />
                  <Icon
                    name="chevron-down"
                    size={14}
                    className="hidden text-text-secondary sm:block"
                  />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-14 w-60 animate-fade-in overflow-hidden rounded-md border border-border bg-bg-secondary shadow-2xl">
                    <div className="border-b border-border px-4 py-3">
                      <p className="truncate text-[15px] font-semibold text-white tracking-tight">
                        {user.displayName}
                      </p>
                      <p className="truncate text-[13px] text-text-secondary/80 mt-0.5">
                        @{user.username}
                      </p>
                    </div>
                    <nav className="py-2 text-[13px]">
                      <MenuLink href={`/u/${user.username}`} icon="user" label={t("nav.myProfile")} onClose={() => setMenuOpen(false)} />
                      <MenuLink href="/new-topic" icon="plus" label={t("nav.newTopic")} onClose={() => setMenuOpen(false)} />
                      <MenuLink href="/new-room" icon="rooms" label={t("nav.newRoom")} onClose={() => setMenuOpen(false)} />
                      <MenuLink href="/saved" icon="bookmark" label={t("nav.saved")} onClose={() => setMenuOpen(false)} />
                      <MenuLink href="/notifications" icon="bell" label={t("nav.notifications")} onClose={() => setMenuOpen(false)} />
                      <MenuLink href="/settings" icon="settings" label={t("nav.settings")} onClose={() => setMenuOpen(false)} />
                      <MenuLink href="/pricing" icon="star" label={t("nav.subscribe")} onClose={() => setMenuOpen(false)} />
                    </nav>
                    <div className="border-t border-white/[0.05] p-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[13px] font-medium text-[#ff5f56] transition-colors hover:bg-[#ff5f56]/10"
                      >
                        <Icon name="logout" size={16} />
                        {t("nav.signOut")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">
                {t("nav.signIn")}
              </Link>
              <Link href="/register" className="btn-primary rounded-full h-9 px-5 text-[13px] tracking-wide">
                {t("nav.signUp")}
              </Link>
            </div>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/[0.04] bg-[#0c0c0f]/95 px-5 py-4 lg:hidden">
          <form onSubmit={submitSearch} className="relative mb-4 sm:hidden">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary">
              <Icon name="search" size={16} />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("nav.searchShort")}
              className="input pl-10 rounded-full h-10 w-full"
            />
          </form>
          <nav className="flex flex-col gap-1.5">
            <MobileLink href="/" label={t("nav.home")} icon="home" onClick={() => setMobileOpen(false)} />
            <MobileLink href="/explore" label={t("nav.explore")} icon="explore" onClick={() => setMobileOpen(false)} />
            <MobileLink href="/rooms" label={t("nav.rooms")} icon="rooms" onClick={() => setMobileOpen(false)} />
          </nav>
        </div>
      )}
    </header>
  );
}

function MenuLink({
  href,
  icon,
  label,
  onClose,
}: {
  href: string;
  icon: Parameters<typeof Icon>[0]["name"];
  label: string;
  onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center gap-3 px-5 py-2.5 text-text-secondary transition-colors hover:bg-white/[0.03] hover:text-white mx-2 rounded-md"
    >
      <Icon name={icon} size={16} />
      {label}
    </Link>
  );
}

function MobileLink({
  href,
  label,
  icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: Parameters<typeof Icon>[0]["name"];
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-text-secondary transition-colors duration-150 hover:bg-white/[0.03] hover:text-white"
    >
      <Icon name={icon} size={18} />
      {label}
    </Link>
  );
}
