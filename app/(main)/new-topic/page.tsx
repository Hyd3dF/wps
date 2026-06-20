"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MarkdownEditor } from "@/components/ui/MarkdownEditor";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/components/providers/I18nProvider";
import { useCategories } from "@/hooks/useCategories";
import { CreateCategoryModal } from "@/components/category/CreateCategoryModal";
import { cn } from "@/lib/utils";

export default function NewTopicPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { categories } = useCategories();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<string>("general");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<{ title?: string; body?: string; category?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Category select state
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    const next: { title?: string; body?: string; category?: string } = {};
    if (title.trim().length < 5) next.title = t("topic.titleError");
    if (body.trim().length < 20) next.body = t("topic.contentError");
    if (!category) next.category = "Category is required";
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

  const selectedCat = categories.find((c) => c.id === category);
  const filteredCategories = categories.filter((c) => c.label.toLowerCase().includes(categorySearch.toLowerCase()));

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center gap-3">
        <Icon name="plus" size={24} className="text-accent" />
        <h1 className="text-2xl font-display font-bold tracking-tight text-white">
          {t("topic.newTopic")}
        </h1>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-6">
        <div>
          <label htmlFor="title" className="mb-2 block text-[13px] font-semibold text-text-secondary/90">
            {t("topic.title")}
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("topic.titlePlaceholder")}
            maxLength={200}
            className="w-full bg-bg-secondary border border-border rounded-lg px-4 py-2.5 text-[14px] text-white placeholder:text-text-secondary/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all"
          />
          <div className="mt-1.5 flex items-center justify-between text-[11px]">
            {errors.title ? (
              <span className="text-danger">{errors.title}</span>
            ) : (
              <span className="text-text-secondary">{t("topic.titleHint")}</span>
            )}
            <span className="tabular-nums text-text-secondary">{title.length}/200</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div ref={categoryRef} className="relative">
            <label className="mb-2 block text-[13px] font-semibold text-text-secondary/90">
              {t("topic.category")}
            </label>
            <button
              type="button"
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="w-full flex items-center justify-between bg-bg-secondary border border-border rounded-lg px-4 py-2.5 text-[14px] text-white hover:border-text-secondary/50 transition-colors"
            >
              {selectedCat ? (
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: selectedCat.color }} />
                  {selectedCat.label}
                </span>
              ) : (
                <span className="text-text-secondary/60">Select category...</span>
              )}
              <Icon name="chevron-down" size={16} className={cn("text-text-secondary transition-transform", categoryOpen && "rotate-180")} />
            </button>
            
            {categoryOpen && (
              <div className="absolute top-full mt-1.5 w-full bg-bg-secondary border border-border rounded-lg shadow-xl z-20 overflow-hidden animate-fade-in flex flex-col max-h-[240px]">
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <Icon name="search" size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                      type="text"
                      placeholder="Search categories..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="w-full bg-bg-tertiary/50 border-none rounded text-[13px] text-white pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>
                <div className="overflow-y-auto custom-scrollbar p-1">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setCategory(c.id);
                          setCategoryOpen(false);
                          setCategorySearch("");
                        }}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 text-[13px] rounded-md transition-colors",
                          category === c.id ? "bg-accent/10 text-accent font-medium" : "text-text-secondary hover:bg-bg-tertiary hover:text-white"
                        )}
                      >
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                        {c.label}
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-[12px] text-text-secondary">No categories found.</div>
                  )}
                </div>
                <div className="p-2 border-t border-border bg-bg-tertiary/30">
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryOpen(false);
                      setIsCategoryModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[12px] font-medium text-accent hover:text-accent-hover transition-colors"
                  >
                    <Icon name="plus" size={14} />
                    Create New Category
                  </button>
                </div>
              </div>
            )}
            {errors.category && <p className="mt-1.5 text-[11px] text-danger">{errors.category}</p>}
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-semibold text-text-secondary/90">
              {t("topic.tags")}
            </label>
            <div className="flex flex-wrap items-center gap-2 min-h-[42px] bg-bg-secondary border border-border rounded-lg px-2 py-1.5 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/50 transition-all">
              {tags.map((tg) => (
                <span key={tg} className="inline-flex items-center gap-1 rounded bg-bg-tertiary px-2 py-1 text-[12px] font-medium text-text-primary">
                  <span className="text-text-secondary/70">#</span>
                  {tg}
                  <button
                    type="button"
                    onClick={() => removeTag(tg)}
                    className="ml-0.5 text-text-secondary hover:text-danger"
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
                    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
                      setTags(tags.slice(0, -1));
                    }
                  }}
                  onBlur={addTag}
                  placeholder={tags.length === 0 ? t("topic.tagPlaceholder") : ""}
                  className="flex-1 min-w-[120px] bg-transparent text-[13px] text-white placeholder:text-text-secondary/60 focus:outline-none px-2 py-0.5"
                />
              )}
            </div>
            <p className="mt-1.5 text-[11px] text-text-secondary">
              {t("topic.tagsHint")} ({tags.length}/5)
            </p>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[13px] font-semibold text-text-secondary/90">
            {t("topic.content")}
          </label>
          <div className="border border-border rounded-lg overflow-hidden focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/50 transition-all">
            <MarkdownEditor
              value={body}
              onChange={setBody}
              placeholder={t("topic.markdownPlaceholder")}
            />
          </div>
          {errors.body && <p className="mt-1.5 text-[11px] text-danger">{errors.body}</p>}
        </div>

        {apiError && <p role="alert" className="text-[13px] text-danger font-medium">{apiError}</p>}

        <div className="flex items-center justify-end gap-4 mt-2">
          <button type="button" onClick={() => router.back()} className="text-[13px] font-semibold text-text-secondary hover:text-white transition-colors">
            {t("common.cancel")}
          </button>
          <button type="submit" disabled={submitting} className="btn-primary rounded-full px-8 py-2.5 shadow-accent/20">
            <Icon name="send" size={16} />
            {submitting ? t("topic.publishing") : t("topic.publish")}
          </button>
        </div>
      </form>

      <CreateCategoryModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
        onCreated={(cat) => {
          setCategory(cat.id);
          setIsCategoryModalOpen(false);
        }} 
      />
    </div>
  );
}
