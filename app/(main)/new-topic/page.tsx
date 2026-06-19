"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MarkdownEditor } from "@/components/ui/MarkdownEditor";
import { Icon } from "@/components/ui/Icon";
import { CATEGORIES } from "@/types";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

export default function NewTopicPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<Category>("dev");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const addTag = () => {
    const t = tagInput
      .trim()
      .toLocaleLowerCase("tr-TR")
      .replace(/[çğıöşü]/g, (char) => ({ ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" })[char] || char)
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags((prev) => [...prev, t]);
    }
    setTagInput("");
  };

  const removeTag = (t: string) => setTags((prev) => prev.filter((x) => x !== t));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: { title?: string; body?: string } = {};
    if (title.trim().length < 5) next.title = "Başlık en az 5 karakter olmalı";
    if (body.trim().length < 20) next.body = "İçerik en az 20 karakter olmalı";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSubmitting(true);
      setApiError("");
      try {
        const response = await fetch("/api/backend/topics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: title.trim(), body: body.trim(), category, tags }),
        });
        const data = await response.json().catch(() => null) as
          | { topic?: { id: string }; error?: { message?: string } }
          | null;
        if (!response.ok || !data?.topic) throw new Error(data?.error?.message || "Konu oluşturulamadı");
        router.push(`/topics/${data.topic.id}`);
      } catch (error) {
        setApiError(error instanceof Error ? error.message : "Konu oluşturulamadı");
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-2">
        <Icon name="plus" size={22} className="text-accent" />
        <h1 className="text-2xl font-display font-bold tracking-tight text-text-primary">
          Yeni Konu Aç
        </h1>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-5">
        <div className="card">
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-text-primary">
            Başlık
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Konunun özü nedir? Net bir başlık yaz."
            maxLength={200}
            className="input text-base"
          />
          <div className="mt-1.5 flex items-center justify-between text-xs">
            {errors.title ? (
              <span className="text-danger">{errors.title}</span>
            ) : (
              <span className="text-text-secondary">Bir soru sor ya da bir iddia ortaya koy.</span>
            )}
            <span className="tabular-nums text-text-secondary">{title.length}/200</span>
          </div>
        </div>

        <div className="card">
          <label className="mb-2 block text-sm font-medium text-text-primary">Kategori</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-badge px-3 py-1.5 text-sm transition-colors",
                  category === c.id
                    ? "bg-accent text-white"
                    : "bg-bg-tertiary text-text-secondary hover:text-text-primary",
                )}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: category === c.id ? "white" : c.color }}
                />
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Etiketler</label>
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((t) => (
              <span key={t} className="badge-tag gap-1">
                <span className="text-text-secondary/70">#</span>
                {t}
                <button
                  type="button"
                  onClick={() => removeTag(t)}
                  className="ml-1 text-text-secondary hover:text-danger"
                  aria-label={`${t} etiketini kaldır`}
                >
                  <Icon name="close" size={12} />
                </button>
              </span>
            ))}
            {tags.length < 5 && (
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                onBlur={addTag}
                placeholder="etiket ekle, Enter"
                className="min-w-[140px] flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-secondary/70 focus:outline-none"
              />
            )}
          </div>
          <p className="mt-1.5 text-xs text-text-secondary">
            En fazla 5 etiket. Konuyu aramada bulunabilir kılar.
          </p>
        </div>

        <div className="card">
          <label className="mb-2 block text-sm font-medium text-text-primary">İçerik</label>
          <MarkdownEditor
            value={body}
            onChange={setBody}
            placeholder="Markdown ile yaz. Kod blokları için ``` kullan. Örnek:

```ts
const hello = 'world';
```"
          />
          {errors.body && <p className="mt-1.5 text-xs text-danger">{errors.body}</p>}
        </div>

        {apiError && <p role="alert" className="text-sm text-danger">{apiError}</p>}

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="btn-ghost">
            İptal
          </button>
          <button type="submit" disabled={submitting} className="btn-primary">
            <Icon name="send" size={16} />
            {submitting ? "Yayınlanıyor..." : "Konuyu Yayınla"}
          </button>
        </div>
      </form>
    </div>
  );
}
