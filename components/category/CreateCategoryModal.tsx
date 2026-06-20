"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/components/providers/I18nProvider";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (category: any) => void;
}

export function CreateCategoryModal({ isOpen, onClose, onCreated }: CreateCategoryModalProps) {
  const { t } = useI18n();
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("#6C63FF");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!label.trim()) {
      setError(t("createCategory.errorEmpty"));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/custom-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: label.trim(), color }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create category");
      }

      const newCat = await res.json();
      onCreated(newCat);
      onClose();
      setLabel("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const PRESET_COLORS = [
    "#6C63FF", "#22C55E", "#EC4899", "#F59E0B", 
    "#06B6D4", "#8B5CF6", "#EF4444", "#10B981"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-md border border-border bg-bg-secondary shadow-2xl p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors"
        >
          <Icon name="close" size={20} />
        </button>

        <h2 className="text-lg font-display font-bold text-white mb-5">
          {t("createCategory.title")}
        </h2>

        {error && (
          <div className="mb-4 text-sm text-danger bg-danger/10 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-[13px] font-semibold text-white mb-1.5">
              {t("createCategory.nameLabel")}
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Next.js, AI, DevOps"
              className="w-full rounded bg-bg-tertiary border border-border px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
              maxLength={20}
              required
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-white mb-2">
              {t("createCategory.colorLabel")}
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${color === c ? "border-white scale-110" : "border-transparent hover:scale-110"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-[12px] text-text-secondary">{t("createCategory.customColor")}</span>
              <input 
                type="color" 
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-text-secondary hover:text-white"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-5 py-2 text-sm"
            >
              {isSubmitting ? t("common.saving") : t("createCategory.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
