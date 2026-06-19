"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

export function Navbar() {
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
    <header className="sticky top-0 z-40 border-b border-border bg-bg-primary/85 backdrop-blur-md">
      <div className="container-app flex h-14 items-center gap-3">
        <div className="flex items-center gap-2 lg:gap-0">
          <button
            type="button"
            className="icon-btn lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menü"
          >
            <Icon name={mobileOpen ? "close" : "menu"} />
          </button>
          <Logo />
        </div>

        <form onSubmit={submitSearch} className="relative ml-2 hidden flex-1 sm:block max-w-md">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
            <Icon name="search" size={18} />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Konu, kullanıcı, oda ara..."
            className="input pl-10"
          />
        </form>

        <div className="ml-auto flex items-center gap-1">
          {isAuthenticated && user ? (
            <>
              <Link
                href="/notifications"
                className="icon-btn relative"
                aria-label="Bildirimler"
              >
                <Icon name="bell" />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
              <Link href="/new-topic" className="btn-primary hidden sm:inline-flex">
                <Icon name="plus" size={16} />
                Konu Aç
              </Link>
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-1.5 rounded-btn p-0.5 transition-colors hover:bg-bg-tertiary"
                  aria-label="Hesap menüsü"
                  aria-expanded={menuOpen}
                >
                  <Avatar user={user} size={32} />
                  <Icon
                    name="chevron-down"
                    size={14}
                    className="mr-1 hidden text-text-secondary sm:block"
                  />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-12 w-56 animate-fade-in overflow-hidden rounded-card border border-border bg-bg-secondary shadow-xl shadow-black/40">
                    <div className="border-b border-border px-4 py-3">
                      <p className="truncate text-sm font-semibold text-text-primary">
                        {user.displayName}
                      </p>
                      <p className="truncate text-xs text-text-secondary">
                        @{user.username}
                      </p>
                    </div>
                    <nav className="py-1 text-sm">
                      <MenuLink href={`/u/${user.username}`} icon="user" label="Profilim" onClose={() => setMenuOpen(false)} />
                      <MenuLink href="/new-topic" icon="plus" label="Yeni Konu" onClose={() => setMenuOpen(false)} />
                      <MenuLink href="/new-room" icon="rooms" label="Yeni Oda" onClose={() => setMenuOpen(false)} />
                      <MenuLink href="/saved" icon="bookmark" label="Kaydedilenler" onClose={() => setMenuOpen(false)} />
                      <MenuLink href="/notifications" icon="bell" label="Bildirimler" onClose={() => setMenuOpen(false)} />
                      <MenuLink href="/settings" icon="settings" label="Ayarlar" onClose={() => setMenuOpen(false)} />
                      <MenuLink href="/pricing" icon="star" label="Abone Ol" onClose={() => setMenuOpen(false)} />
                    </nav>
                    <div className="border-t border-border py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-danger transition-colors hover:bg-danger/10"
                      >
                        <Icon name="logout" size={16} />
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="btn-ghost">
                Giriş Yap
              </Link>
              <Link href="/register" className="btn-primary">
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-bg-secondary px-4 py-3 lg:hidden">
          <form onSubmit={submitSearch} className="relative mb-3 sm:hidden">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
              <Icon name="search" size={18} />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ara..."
              className="input pl-10"
            />
          </form>
          <nav className="flex flex-col gap-1">
            <MobileLink href="/" label="Ana Sayfa" icon="home" onClick={() => setMobileOpen(false)} />
            <MobileLink href="/explore" label="Keşfet" icon="explore" onClick={() => setMobileOpen(false)} />
            <MobileLink href="/rooms" label="Odalar" icon="rooms" onClick={() => setMobileOpen(false)} />
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
      className="flex items-center gap-3 px-4 py-2 text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
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
      className={cn("nav-link")}
    >
      <Icon name={icon} size={18} />
      {label}
    </Link>
  );
}
