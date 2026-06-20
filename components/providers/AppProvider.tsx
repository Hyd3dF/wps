"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useI18n } from "@/components/providers/I18nProvider";
import type { AppNotification, User } from "@/types";

interface AuthInput {
  email: string;
  password: string;
}

interface RegisterInput extends AuthInput {
  displayName: string;
  username: string;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  notifications: AppNotification[];
  unreadCount: number;
  login: (input: AuthInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  markAllRead: () => void;
  markRead: (id: string) => void;
  reloadUser: () => Promise<void>;
  toggleSave: (topicId: string) => void;
  savedTopicIds: string[];
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [savedTopicIds, setSavedTopicIds] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/backend/auth/me", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as { user: User };
      })
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    const controller = new AbortController();
    fetch("/api/backend/notifications", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json();
      })
      .then((data) => {
        if (data?.notifications) {
          const mapped = data.notifications.map((n: any) => ({
            id: n.id,
            type: n.type,
            title: n.title,
            body: n.body || "",
            link: n.link || "#",
            isRead: n.isRead,
            actor: n.actorUsername ? {
              id: n.actorId || "",
              username: n.actorUsername,
              displayName: n.actorUsername,
              avatarUrl: n.actorAvatarUrl,
              email: "",
              bio: "",
              websiteUrl: null,
              githubUrl: null,
              twitterUrl: null,
              reputation: 0,
              topicCount: 0,
              commentCount: 0,
              followersCount: 0,
              followingCount: 0,
              joinedAt: "",
            } : null,
            createdAt: n.createdAt,
          }));
          setNotifications(mapped);
        }
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [user]);

  const authenticate = useCallback(async (path: "login" | "register", input: AuthInput | RegisterInput) => {
    const response = await fetch(`/api/backend/auth/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = (await response.json().catch(() => null)) as
      | { user?: User; error?: { message?: string } }
      | null;
    if (!response.ok || !data?.user) {
      throw new Error(data?.error?.message || t("common.error"));
    }
    setUser(data.user);
  }, [t]);

  const login = useCallback(async (input: AuthInput) => {
    await authenticate("login", input);
  }, [authenticate]);

  const register = useCallback(async (input: RegisterInput) => {
    await authenticate("register", input);
  }, [authenticate]);

  const logout = useCallback(async () => {
    await fetch("/api/backend/auth/logout", { method: "POST" }).catch(() => undefined);
    setUser(null);
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
    await fetch("/api/backend/notifications/read-all", { method: "POST" }).catch(() => undefined);
  }, []);

  const markRead = useCallback(async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    await fetch(`/api/backend/notifications/${id}/read`, { method: "PATCH" }).catch(() => undefined);
  }, []);

  const reloadUser = useCallback(async () => {
    try {
      const response = await fetch("/api/backend/auth/me", { cache: "no-store" });
      if (response.ok) {
        const data = await response.json() as { user: User };
        setUser(data.user);
      }
    } catch {}
  }, []);

  const toggleSave = useCallback((topicId: string) => {
    setSavedTopicIds((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId],
    );
  }, []);

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;
  const isAuthenticated = user !== null;

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        notifications,
        unreadCount,
        login,
        register,
        logout,
        markAllRead,
        markRead,
        reloadUser,
        toggleSave,
        savedTopicIds,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
