"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { useApp } from "@/components/providers/AppProvider";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useI18n } from "@/components/providers/I18nProvider";

export default function SettingsPage() {
  const { t, locale } = useI18n();
  const { user, reloadUser } = useApp();
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    displayName: user?.displayName ?? "",
    bio: user?.bio ?? "",
    websiteUrl: user?.websiteUrl ?? "",
    githubUrl: user?.githubUrl ?? "",
    twitterUrl: user?.twitterUrl ?? "",
  });

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl">
        <EmptyState
          icon="lock"
          title={t("settings.loginRequired")}
          description={t("settings.loginRequiredDesc")}
          action={
            <Link href="/login" className="btn-primary rounded-full">
              <Icon name="logout" size={16} />
              {t("settings.signIn")}
            </Link>
          }
        />
      </div>
    );
  }

  const update = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setSaved(false);
    setError("");
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSaved(false);
    try {
      const response = await fetch("/api/backend/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => null) as
        | { user?: any; error?: { message?: string } }
        | null;
      if (!response.ok) {
        throw new Error(data?.error?.message || t("settings.saveError"));
      }
      await reloadUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("settings.saveError"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/backend/users/me/avatar", {
        method: "POST",
        body: formData,
      });
      const data = await response.json().catch(() => null) as
        | { user?: any; error?: { message?: string } }
        | null;
      if (!response.ok) {
        throw new Error(data?.error?.message || t("settings.avatarError"));
      }
      await reloadUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("settings.avatarError"));
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl relative pb-12">
      <h1 className="mb-8 flex items-center gap-3 text-3xl font-display font-extrabold tracking-tight text-white">
        <Icon name="settings" size={28} className="text-accent" />
        {t("settings.title")}
      </h1>

      <div className="card mb-8 flex items-center justify-between gap-5 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-50" />
        <div className="relative z-10">
          <h2 className="font-display font-bold text-white text-[15px]">{t("settings.language")}</h2>
          <p className="mt-1 text-[13px] text-text-secondary/80 font-medium">
            {t("settings.languageDesc")}
          </p>
        </div>
        <div className="relative z-10">
          <LanguageSwitcher />
        </div>
      </div>

      <Tabs
        items={[
          {
            id: "profile",
            label: t("settings.tabProfile"),
            content: (
              <form onSubmit={save} className="flex flex-col gap-6 animate-fade-in">
                <div className="card relative overflow-hidden">
                  <h2 className="mb-5 font-display text-[15px] font-bold text-white tracking-tight">{t("settings.avatar")}</h2>
                  <div className="flex items-center gap-5 relative z-10">
                    <Avatar user={user} size={80} className="ring-4 ring-white/[0.03] shadow-xl" />
                    <div className="flex flex-col gap-2.5">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingAvatar}
                        className="btn-secondary rounded-full px-5 py-2 text-[12px] h-9"
                      >
                        <Icon name="image" size={14} />
                        {uploadingAvatar ? t("settings.uploading") : t("settings.uploadAvatar")}
                      </button>
                      <p className="text-[11px] font-medium text-text-secondary/60">{t("settings.avatarHint")}</p>
                    </div>
                  </div>
                </div>

                <div className="card relative overflow-hidden">
                  <h2 className="mb-5 font-display text-[15px] font-bold text-white tracking-tight">{t("settings.general")}</h2>
                  <div className="relative z-10 space-y-5">
                    <Field label={t("settings.displayName")}>
                      <input
                        type="text"
                        value={form.displayName}
                        onChange={(e) => update("displayName", e.target.value)}
                        maxLength={64}
                        className="input rounded-xl text-[13px]"
                      />
                    </Field>
                    <Field label={t("settings.bio")}>
                      <textarea
                        value={form.bio}
                        onChange={(e) => update("bio", e.target.value)}
                        maxLength={500}
                        placeholder={t("settings.bioPlaceholder")}
                        className="textarea min-h-[100px] rounded-xl text-[13px]"
                      />
                      <p className="mt-1.5 text-right text-[11px] font-mono tabular-nums text-text-secondary/60">
                        {form.bio.length}/500
                      </p>
                    </Field>
                  </div>
                </div>

                <div className="card relative overflow-hidden">
                  <h2 className="mb-5 font-display text-[15px] font-bold text-white tracking-tight">{t("settings.links")}</h2>
                  <div className="relative z-10 space-y-5">
                    <Field label={t("settings.website")}>
                      <input
                        type="url"
                        value={form.websiteUrl}
                        onChange={(e) => update("websiteUrl", e.target.value)}
                        placeholder="https://"
                        className="input rounded-xl text-[13px]"
                      />
                    </Field>
                    <Field label={t("settings.github")}>
                      <input
                        type="url"
                        value={form.githubUrl}
                        onChange={(e) => update("githubUrl", e.target.value)}
                        placeholder="https://github.com/username"
                        className="input rounded-xl text-[13px]"
                      />
                    </Field>
                    <Field label={t("settings.twitter")}>
                      <input
                        type="url"
                        value={form.twitterUrl}
                        onChange={(e) => update("twitterUrl", e.target.value)}
                        placeholder="https://twitter.com/username"
                        className="input rounded-xl text-[13px]"
                      />
                    </Field>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 mt-4">
                  {error && <div className="rounded-lg bg-danger/10 px-3 py-2 text-[12px] font-medium text-danger border border-danger/20">{error}</div>}
                  <div className="flex items-center justify-end gap-4">
                    {saved && (
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#27c93f] animate-fade-in">
                        <Icon name="check" size={16} />
                        {t("common.saved")}
                      </span>
                    )}
                    <button type="submit" disabled={submitting} className="btn-primary rounded-full px-8 py-2.5 h-[42px] shadow-accent/20">
                      {submitting ? t("common.saving") : (
                        <>
                          <Icon name="check" size={16} />
                          {t("common.save")}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ),
          },
          {
            id: "account",
            label: t("settings.tabAccount"),
            content: (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div className="card relative overflow-hidden">
                  <h2 className="mb-1.5 font-display text-[15px] font-bold text-white tracking-tight">{t("settings.email")}</h2>
                  <p className="text-[13px] font-medium text-text-secondary">{user.email}</p>
                </div>
                <div className="card relative overflow-hidden">
                  <h2 className="mb-1.5 font-display text-[15px] font-bold text-white tracking-tight">{t("settings.password")}</h2>
                  <p className="mb-4 text-[13px] text-text-secondary/80 font-medium">{t("settings.passwordHint")}</p>
                  <button type="button" className="btn-secondary rounded-full px-5 py-2 text-[12px] h-9">{t("settings.changePassword")}</button>
                </div>
                <div className="card border-danger/40 bg-danger/[0.02] relative overflow-hidden">
                  <h2 className="mb-1.5 font-display text-[15px] font-bold text-danger tracking-tight">{t("settings.dangerZone")}</h2>
                  <p className="mb-4 text-[13px] text-text-secondary/80 font-medium">
                    {t("settings.dangerDesc")}
                  </p>
                  <button type="button" className="btn-danger rounded-full px-5 py-2.5 h-10 shadow-[#ff5f56]/20">
                    <Icon name="trash" size={16} />
                    {t("settings.deleteAccount")}
                  </button>
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      <label className="mb-2 block text-[13px] font-semibold text-text-secondary/90">{label}</label>
      {children}
    </div>
  );
}
