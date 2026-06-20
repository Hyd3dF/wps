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
      <h1 className="mb-8 flex items-center gap-3 text-2xl font-display font-bold tracking-tight text-white">
        <Icon name="settings" size={24} className="text-accent" />
        {t("settings.title")}
      </h1>

      {/* Language Section - Flattened */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-border pb-6">
        <div>
          <h2 className="font-display font-bold text-white text-[14px]">{t("settings.language")}</h2>
          <p className="mt-1 text-[13px] text-text-secondary">
            {t("settings.languageDesc")}
          </p>
        </div>
        <div>
          <LanguageSwitcher />
        </div>
      </div>

      <Tabs
        items={[
          {
            id: "profile",
            label: t("settings.tabProfile"),
            content: (
              <form onSubmit={save} className="flex flex-col gap-8 animate-fade-in pt-4">
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-6 border-b border-border pb-8">
                  <div className="sm:w-1/3">
                    <h2 className="font-display text-[14px] font-bold text-white tracking-tight">{t("settings.avatar")}</h2>
                    <p className="text-[12px] mt-1 text-text-secondary">{t("settings.avatarHint")}</p>
                  </div>
                  <div className="sm:w-2/3 flex items-center gap-5">
                    <Avatar user={user} size={72} className="ring-1 ring-white/10" />
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
                        className="btn-secondary rounded-md px-4 py-1.5 text-[12px]"
                      >
                        <Icon name="image" size={14} />
                        {uploadingAvatar ? t("settings.uploading") : t("settings.uploadAvatar")}
                      </button>
                    </div>
                  </div>
                </div>

                {/* General Section */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-6 border-b border-border pb-8">
                  <div className="sm:w-1/3">
                    <h2 className="font-display text-[14px] font-bold text-white tracking-tight">{t("settings.general")}</h2>
                    <p className="text-[12px] mt-1 text-text-secondary">Basic information about yourself.</p>
                  </div>
                  <div className="sm:w-2/3 space-y-5">
                    <Field label={t("settings.displayName")}>
                      <input
                        type="text"
                        value={form.displayName}
                        onChange={(e) => update("displayName", e.target.value)}
                        maxLength={64}
                        className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2 text-[14px] text-white focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
                      />
                    </Field>
                    <Field label={t("settings.bio")}>
                      <textarea
                        value={form.bio}
                        onChange={(e) => update("bio", e.target.value)}
                        maxLength={500}
                        placeholder={t("settings.bioPlaceholder")}
                        className="w-full min-h-[90px] resize-y bg-bg-secondary border border-border rounded-lg px-3 py-2 text-[14px] text-white focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
                      />
                      <p className="mt-1.5 text-right text-[11px] font-mono tabular-nums text-text-secondary/60">
                        {form.bio.length}/500
                      </p>
                    </Field>
                  </div>
                </div>

                {/* Links Section */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-6 pb-4">
                  <div className="sm:w-1/3">
                    <h2 className="font-display text-[14px] font-bold text-white tracking-tight">{t("settings.links")}</h2>
                    <p className="text-[12px] mt-1 text-text-secondary">Links to your other online profiles.</p>
                  </div>
                  <div className="sm:w-2/3 space-y-5">
                    <Field label={t("settings.website")}>
                      <input
                        type="url"
                        value={form.websiteUrl}
                        onChange={(e) => update("websiteUrl", e.target.value)}
                        placeholder="https://"
                        className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2 text-[14px] text-white focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
                      />
                    </Field>
                    <Field label={t("settings.github")}>
                      <input
                        type="url"
                        value={form.githubUrl}
                        onChange={(e) => update("githubUrl", e.target.value)}
                        placeholder="https://github.com/username"
                        className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2 text-[14px] text-white focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
                      />
                    </Field>
                    <Field label={t("settings.twitter")}>
                      <input
                        type="url"
                        value={form.twitterUrl}
                        onChange={(e) => update("twitterUrl", e.target.value)}
                        placeholder="https://twitter.com/username"
                        className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2 text-[14px] text-white focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
                      />
                    </Field>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 mt-4 pt-4 border-t border-border">
                  {error && <div className="rounded-md bg-danger/10 px-3 py-2 text-[12px] font-medium text-danger border border-danger/20">{error}</div>}
                  <div className="flex items-center justify-end gap-4">
                    {saved && (
                      <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[#27c93f] animate-fade-in">
                        <Icon name="check" size={14} />
                        {t("common.saved")}
                      </span>
                    )}
                    <button type="submit" disabled={submitting} className="btn-primary rounded-md px-6 py-2 shadow-accent/20">
                      {submitting ? t("common.saving") : t("common.save")}
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
              <div className="flex flex-col gap-8 animate-fade-in pt-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-6 border-b border-border pb-8">
                  <div className="sm:w-1/3">
                    <h2 className="font-display text-[14px] font-bold text-white tracking-tight">{t("settings.email")}</h2>
                  </div>
                  <div className="sm:w-2/3">
                    <p className="text-[13px] font-medium text-text-secondary">{user.email}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start gap-6 border-b border-border pb-8">
                  <div className="sm:w-1/3">
                    <h2 className="font-display text-[14px] font-bold text-white tracking-tight">{t("settings.password")}</h2>
                  </div>
                  <div className="sm:w-2/3">
                    <p className="mb-3 text-[13px] text-text-secondary">{t("settings.passwordHint")}</p>
                    <button type="button" className="btn-secondary rounded-md px-4 py-1.5 text-[12px]">{t("settings.changePassword")}</button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start gap-6 pb-4">
                  <div className="sm:w-1/3">
                    <h2 className="font-display text-[14px] font-bold text-danger tracking-tight">{t("settings.dangerZone")}</h2>
                  </div>
                  <div className="sm:w-2/3">
                    <p className="mb-3 text-[13px] text-text-secondary">
                      {t("settings.dangerDesc")}
                    </p>
                    <button type="button" className="btn-danger rounded-md px-4 py-2 text-[13px] shadow-[#ff5f56]/20">
                      <Icon name="trash" size={14} />
                      {t("settings.deleteAccount")}
                    </button>
                  </div>
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
