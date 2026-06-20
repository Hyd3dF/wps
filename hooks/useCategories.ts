"use client";

import { useState, useEffect } from "react";
import { CATEGORIES, type DynamicCategory } from "@/types";
import { useI18n } from "@/components/providers/I18nProvider";

export function useCategories() {
  const { t } = useI18n();
  const [customCategories, setCustomCategories] = useState<DynamicCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/custom-categories")
      .then((res) => res.json())
      .then((data) => {
        setCustomCategories(data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch custom categories", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const mergedCategories: DynamicCategory[] = [
    ...CATEGORIES.map((c) => ({
      id: c.id,
      label: t(`category.${c.id}`) !== `category.${c.id}` ? t(`category.${c.id}`) : c.label,
      color: c.color,
    })),
    ...customCategories,
  ];

  return { categories: mergedCategories, isLoading };
}
