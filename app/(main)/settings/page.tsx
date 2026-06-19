"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { useApp } from "@/components/providers/AppProvider";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
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
          title="Giriş gerekli"
          description="Ayarlarına erişmek için önce giriş yapmalısın."
          action={
            <Link href="/login" className="btn-primary">
              <Icon name="logout" size={16} />
              Giriş Yap
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
        throw new Error(data?.error?.message || "Ayarlar kaydedilemedi");
      }
      await reloadUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ayarlar kaydedilemedi");
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
        throw new Error(data?.error?.message || "Avatar yüklenemedi");
      }
      await reloadUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Avatar yüklenemedi");
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-display font-bold tracking-tight text-text-primary">
        <Icon name="settings" size={22} className="text-accent" />
        Ayarlar
      </h1>

      <Tabs
        items={[
          {
            id: "profile",
            label: "Profil",
            content: (
              <form onSubmit={save} className="flex flex-col gap-5">
                <div className="card">
                  <h2 className="mb-4 font-display font-semibold text-text-primary">Avatar</h2>
                  <div className="flex items-center gap-4">
                    <Avatar user={user} size={72} />
                    <div className="flex flex-col gap-2">
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
                        className="btn-secondary"
                      >
                        <Icon name="image" size={16} />
                        {uploadingAvatar ? "Yükleniyor..." : "Yeni avatar yükle"}
                      </button>
                      <p className="text-xs text-text-secondary">JPEG/PNG, maks 2MB, 256×256.</p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h2 className="mb-4 font-display font-semibold text-text-primary">Genel</h2>
                  <Field label="Görünen ad">
                    <input
                      type="text"
                      value={form.displayName}
                      onChange={(e) => update("displayName", e.target.value)}
                      maxLength={64}
                      className="input"
                    />
                  </Field>
                  <Field label="Bio" className="mt-4">
                    <textarea
                      value={form.bio}
                      onChange={(e) => update("bio", e.target.value)}
                      maxLength={500}
                      placeholder="Kendinden kısaca bahset"
                      className="textarea min-h-[90px]"
                    />
                    <p className="mt-1 text-right text-xs tabular-nums text-text-secondary">
                      {form.bio.length}/500
                    </p>
                  </Field>
                </div>

                <div className="card">
                  <h2 className="mb-4 font-display font-semibold text-text-primary">Bağlantılar</h2>
                  <Field label="Website">
                    <input
                      type="url"
                      value={form.websiteUrl}
                      onChange={(e) => update("websiteUrl", e.target.value)}
                      placeholder="https://"
                      className="input"
                    />
                  </Field>
                  <Field label="GitHub" className="mt-4">
                    <input
                      type="url"
                      value={form.githubUrl}
                      onChange={(e) => update("githubUrl", e.target.value)}
                      placeholder="https://github.com/kullanici"
                      className="input"
                    />
                  </Field>
                  <Field label="Twitter" className="mt-4">
                    <input
                      type="url"
                      value={form.twitterUrl}
                      onChange={(e) => update("twitterUrl", e.target.value)}
                      placeholder="https://twitter.com/kullanici"
                      className="input"
                    />
                  </Field>
                </div>

                <div className="flex flex-col items-end gap-2 mt-2">
                  {error && <p className="text-sm text-danger">{error}</p>}
                  <div className="flex items-center justify-end gap-3">
                    {saved && (
                      <span className="inline-flex items-center gap-1 text-sm text-success">
                        <Icon name="check" size={16} />
                        Kaydedildi
                      </span>
                    )}
                    <button type="submit" disabled={submitting} className="btn-primary">
                      <Icon name="check" size={16} />
                      {submitting ? "Kaydediliyor..." : "Kaydet"}
                    </button>
                  </div>
                </div>
              </form>
            ),
          },
          {
            id: "account",
            label: "Hesap",
            content: (
              <div className="flex flex-col gap-5">
                <div className="card">
                  <h2 className="mb-1 font-display font-semibold text-text-primary">E-posta</h2>
                  <p className="text-sm text-text-secondary">{user.email}</p>
                </div>
                <div className="card">
                  <h2 className="mb-1 font-display font-semibold text-text-primary">Şifre</h2>
                  <p className="mb-3 text-sm text-text-secondary">Hesabının güvenliği için düzenli değiştir.</p>
                  <button type="button" className="btn-secondary">Şifreyi değiştir</button>
                </div>
                <div className="card border-danger/40">
                  <h2 className="mb-1 font-display font-semibold text-danger">Tehlikeli bölge</h2>
                  <p className="mb-3 text-sm text-text-secondary">
                    Hesabını silmek tüm konu, yorum ve verini kalıcı olarak kaldırır.
                  </p>
                  <button type="button" className="btn-danger">
                    <Icon name="trash" size={16} />
                    Hesabı Sil
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
      <label className="mb-1.5 block text-sm font-medium text-text-primary">{label}</label>
      {children}
    </div>
  );
}
