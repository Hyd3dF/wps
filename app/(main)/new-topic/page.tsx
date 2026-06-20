"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MarkdownEditor } from "@/components/ui/MarkdownEditor";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/components/providers/I18nProvider";
import { CATEGORIES } from "@/types";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

export default function NewTopicPage() {
  const { t } = useI18n();
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
    const tInput = tagInput
      .trim()
      .toLocaleLowerCase("tr-TR")
      .replace(/[çğıöşü]/g, (char) => ({ ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" })[char] || char)
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    if (tInput && !tags.includes(tInput) && tags.length < 5) {
      setTags((prev) => [...prev, tInput]);
    }
    setTagInput("");
  };

  const removeTag = (tInput: string) => setTags((prev) => prev.filter((x) => x !== tInput));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: { title?: string; body?: string } = {};
    if (title.trim().length < 5) next.title = t("topic.titleError");
    if (body.trim().length < 20) next.body = t("topic.contentError");
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
        if (!response.ok || !data?.topic) throw new Error(data?.error?.message || t("topic.createError"));
        router.push(`/topics/${data.topic.id}`);
      } catch (error) {
        setApiError(error instanceof Error ? error.message : t("topic.createError"));
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
          {t("topic.newTopic")}
        </h1>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-5">
        <div className="card">
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-text-primary">
            {t("topic.title")}
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("topic.titlePlaceholder")}
            maxLength={200}
            className="input text-base"
          />
          <div className="mt-1.5 flex items-center justify-between text-xs">
            {errors.title ? (
              <span className="text-danger">{errors.title}</span>
            ) : (
              <span className="text-text-secondary">{t("topic.titleHint")}</span>
            )}
            <span className="tabular-nums text-text-secondary">{title.length}/200</span>
          </div>
        </div>

        <div className="card">
          <label className="mb-2 block text-sm font-medium text-text-primary">{t("topic.category")}</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const categoryLabel = t(`category.${c.id}`) !== `category.${c.id}` ? t(`category.${c.id}`) : c.label;
              return (
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
                  {categoryLabel}
                </button>
              );
            })}
          </div>
        </div>

        <div className="card">
          <label className="mb-1.5 block text-sm font-medium text-text-primary">{t("topic.tags")}</label>
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tg) => (
              <span key={tg} className="badge-tag gap-1">
                <span className="text-text-secondary/70">#</span>
                {tg}
                <button
                  type="button"
                  onClick={() => removeTag(tg)}
                  className="ml-1 text-text-secondary hover:text-danger"
                  aria-label={t("topic.removeTagAria", { tag: tg })}
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
                placeholder={t("topic.tagPlaceholder")}
                className="min-w-[140px] flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-secondary/70 focus:outline-none"
              />
            )}
          </div>
          <p className="mt-1.5 text-xs text-text-secondary">
            {t("topic.tagsHint")}
          </p>
        </div>

        <div className="card">
          <label className="mb-2 block text-sm font-medium text-text-primary">{t("topic.content")}</label>
          <MarkdownEditor
            value={body}
            onChange={setBody}
            placeholder={t("topic.markdownPlaceholder")}
          />
          {errors.body && <p className="mt-1.5 text-xs text-danger">{errors.body}</p>}
        </div>

        {apiError && <p role="alert" className="text-sm text-danger">{apiError}</p>}

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="btn-ghost">
            {t("common.cancel")}
          </button>
          <button type="submit" disabled={submitting} className="btn-primary">
            <Icon name="send" size={16} />
            {submitting ? t("topic.publishing") : t("topic.publish")}
          </button>
        </div>
      </form>
    </div>
  );
}
