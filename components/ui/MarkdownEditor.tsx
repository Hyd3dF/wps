"use client";

import { useState, useRef } from "react";
import { Markdown } from "@/components/ui/Markdown";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/providers/I18nProvider";

interface MarkdownEditorProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  minHeight = 280,
}: MarkdownEditorProps) {
  const { t } = useI18n();
  const [mode, setMode] = useState<"write" | "preview">("write");
  const ref = useRef<HTMLTextAreaElement>(null);

  const wrapSelection = (fn: (s: string) => string) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const sel = value.slice(start, end);
    const wrapped = fn(sel);
    const next = value.slice(0, start) + wrapped + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + wrapped.length, start + wrapped.length);
    });
  };

  const insertLine = (text: string) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const next = value.slice(0, lineStart) + text + value.slice(lineStart);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + text.length, start + text.length);
    });
  };

  return (
    <div className="overflow-hidden rounded-card border border-border bg-bg-secondary">
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-bg-tertiary/40 px-2 py-1.5">
        <ToolbarButton label={t("editor.bold")} onClick={() => wrapSelection((s) => `**${s || t("editor.boldPlaceholder")}**`)}>
          <span className="font-bold">B</span>
        </ToolbarButton>
        <ToolbarButton label={t("editor.italic")} onClick={() => wrapSelection((s) => `*${s || t("editor.italicPlaceholder")}*`)}>
          <span className="italic">I</span>
        </ToolbarButton>
        <ToolbarButton label={t("editor.strikethrough")} onClick={() => wrapSelection((s) => `~~${s || t("editor.strikethroughPlaceholder")}~~`)}>
          <span className="line-through">S</span>
        </ToolbarButton>
        <Divider />
        <ToolbarButton label={t("editor.heading1")} onClick={() => insertLine("# ")}>
          <span className="font-bold text-xs">H1</span>
        </ToolbarButton>
        <ToolbarButton label={t("editor.heading2")} onClick={() => insertLine("## ")}>
          <span className="font-bold text-xs">H2</span>
        </ToolbarButton>
        <ToolbarButton label={t("editor.heading3")} onClick={() => insertLine("### ")}>
          <span className="font-bold text-xs">H3</span>
        </ToolbarButton>
        <Divider />
        <ToolbarButton label={t("editor.list")} onClick={() => insertLine("- ")}>
          <Icon name="chevron-right" size={14} />
        </ToolbarButton>
        <ToolbarButton label={t("editor.orderedList")} onClick={() => insertLine("1. ")}>
          <span className="text-xs">1.</span>
        </ToolbarButton>
        <ToolbarButton label={t("editor.quote")} onClick={() => insertLine("> ")}>
          <span className="text-xs">&ldquo;</span>
        </ToolbarButton>
        <ToolbarButton label={t("editor.codeBlock")} onClick={() => wrapSelection((s) => `\n\`\`\`\n${s || t("editor.codePlaceholder")}\n\`\`\`\n`)}>
          <Icon name="hash" size={14} />
        </ToolbarButton>
        <ToolbarButton label={t("editor.inlineCode")} onClick={() => wrapSelection((s) => `\`${s || t("editor.codePlaceholder")}\``)}>
          <span className="font-mono text-xs">{"<>"}</span>
        </ToolbarButton>
        <ToolbarButton label={t("editor.link")} onClick={() => wrapSelection((s) => `[${s || t("editor.linkPlaceholder")}](https://)`)}>
          <Icon name="link" size={14} />
        </ToolbarButton>

        <div className="ml-auto flex items-center gap-1">
          <ModeButton active={mode === "write"} onClick={() => setMode("write")}>
            {t("editor.write")}
          </ModeButton>
          <ModeButton active={mode === "preview"} onClick={() => setMode("preview")}>
            {t("editor.preview")}
          </ModeButton>
        </div>
      </div>

      {mode === "write" ? (
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? t("topic.markdownPlaceholder")}
          className="block w-full resize-y border-0 bg-transparent px-4 py-3 font-mono text-sm leading-relaxed text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:ring-0"
          style={{ minHeight }}
          spellCheck={false}
        />
      ) : (
        <div
          className="px-4 py-3 overflow-y-auto scrollbar-thin"
          style={{ minHeight }}
        >
          {value.trim() ? (
            <Markdown>{value}</Markdown>
          ) : (
            <p className="text-sm text-text-secondary">{t("editor.emptyPreview")}</p>
          )}
        </div>
      )}
    </div>
  );
}

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="flex h-8 min-w-8 items-center justify-center rounded-btn px-2 text-sm text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-border" />;
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-btn px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "bg-bg-tertiary text-text-primary"
          : "text-text-secondary hover:text-text-primary",
      )}
    >
      {children}
    </button>
  );
}
