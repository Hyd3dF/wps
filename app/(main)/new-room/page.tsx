"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export default function NewRoomPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const slugPreview = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-çğıöşü ]/g, "")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/\s+/g, "-")
    .slice(0, 64);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3) {
      setErrors({ name: "Oda adı en az 3 karakter olmalı" });
      return;
    }
    setSubmitting(true);
    setApiError("");
    try {
      const response = await fetch("/api/backend/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim(), isPrivate }),
      });
      const data = await response.json().catch(() => null) as
        | { room?: { slug: string }; error?: { message?: string } }
        | null;
      if (!response.ok || !data?.room) throw new Error(data?.error?.message || "Oda oluşturulamadı");
      router.push(`/rooms/${data.room.slug}`);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Oda oluşturulamadı");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-2">
        <Icon name="rooms" size={22} className="text-accent" />
        <h1 className="text-2xl font-display font-bold tracking-tight text-text-primary">
          Yeni Oda Oluştur
        </h1>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-5">
        <div className="card">
          <label htmlFor="room-name" className="mb-1.5 block text-sm font-medium text-text-primary">
            Oda Adı
          </label>
          <input
            id="room-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="örn. Rust Topluluğı"
            maxLength={64}
            className="input"
          />
          <div className="mt-1.5 flex items-center justify-between text-xs">
            {errors.name ? (
              <span className="text-danger">{errors.name}</span>
            ) : (
              <span className="text-text-secondary">
                Slug: <span className="font-mono text-text-primary">/{slugPreview || "oda-adı"}</span>
              </span>
            )}
            <span className="tabular-nums text-text-secondary">{name.length}/64</span>
          </div>
        </div>

        <div className="card">
          <label htmlFor="room-desc" className="mb-1.5 block text-sm font-medium text-text-primary">
            Açıklama
          </label>
          <textarea
            id="room-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Bu odada ne konuşulur?"
            maxLength={200}
            className="textarea min-h-[100px]"
          />
          <p className="mt-1.5 text-right text-xs tabular-nums text-text-secondary">
            {description.length}/200
          </p>
        </div>

        <div className="card flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-primary">Özel oda</p>
            <p className="text-xs text-text-secondary">
              Sadece davet linki olanlar katılabilir.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isPrivate}
            onClick={() => setIsPrivate((p) => !p)}
            className={cn(
              "relative h-6 w-11 rounded-full transition-colors",
              isPrivate ? "bg-accent" : "bg-bg-tertiary",
            )}
          >
            <span
              className={cn(
                "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                isPrivate ? "translate-x-5" : "translate-x-0",
              )}
            />
          </button>
        </div>

        {apiError && <p role="alert" className="text-sm text-danger">{apiError}</p>}

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="btn-ghost">
            İptal
          </button>
          <button type="submit" disabled={submitting} className="btn-primary">
            <Icon name="plus" size={16} />
            {submitting ? "Oluşturuluyor..." : "Odayı Oluştur"}
          </button>
        </div>
      </form>
    </div>
  );
}
