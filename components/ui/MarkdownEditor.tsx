"use client";

import { useState, useRef } from "react";
import { Markdown } from "@/components/ui/Markdown";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Markdown ile yaz... Kod blokları için ``` kullan.",
  minHeight = 280,
}: MarkdownEditorProps) {
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
        <ToolbarButton label="Kalın" onClick={() => wrapSelection((s) => `**${s || "kalın"}**`)}>
          <span className="font-bold">B</span>
        </ToolbarButton>
        <ToolbarButton label="İtalik" onClick={() => wrapSelection((s) => `*${s || "italik"}*`)}>
          <span className="italic">I</span>
        </ToolbarButton>
        <ToolbarButton label="Üstü çizili" onClick={() => wrapSelection((s) => `~~${s || "çizili"}~~`)}>
          <span className="line-through">S</span>
        </ToolbarButton>
        <Divider />
        <ToolbarButton label="Başlık 1" onClick={() => insertLine("# ")}>
          <span className="font-bold text-xs">H1</span>
        </ToolbarButton>
        <ToolbarButton label="Başlık 2" onClick={() => insertLine("## ")}>
          <span className="font-bold text-xs">H2</span>
        </ToolbarButton>
        <ToolbarButton label="Başlık 3" onClick={() => insertLine("### ")}>
          <span className="font-bold text-xs">H3</span>
        </ToolbarButton>
        <Divider />
        <ToolbarButton label="Liste" onClick={() => insertLine("- ")}>
          <Icon name="chevron-right" size={14} />
        </ToolbarButton>
        <ToolbarButton label="Numaralı" onClick={() => insertLine("1. ")}>
          <span className="text-xs">1.</span>
        </ToolbarButton>
        <ToolbarButton label="Alıntı" onClick={() => insertLine("> ")}>
          <span className="text-xs">&ldquo;</span>
        </ToolbarButton>
        <ToolbarButton label="Kod bloğu" onClick={() => wrapSelection((s) => `\n\`\`\`\n${s || "kod"}\n\`\`\`\n`)}>
          <Icon name="hash" size={14} />
        </ToolbarButton>
        <ToolbarButton label="Satır içi kod" onClick={() => wrapSelection((s) => `\`${s || "kod"}\``)}>
          <span className="font-mono text-xs">{"<>"}</span>
        </ToolbarButton>
        <ToolbarButton label="Bağlantı" onClick={() => wrapSelection((s) => `[${s || "metin"}](https://)`)}>
          <Icon name="link" size={14} />
        </ToolbarButton>

        <div className="ml-auto flex items-center gap-1">
          <ModeButton active={mode === "write"} onClick={() => setMode("write")}>
            Yaz
          </ModeButton>
          <ModeButton active={mode === "preview"} onClick={() => setMode("preview")}>
            Önizle
          </ModeButton>
        </div>
      </div>

      {mode === "write" ? (
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
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
            <p className="text-sm text-text-secondary">Önizleme boş. Bir şey yaz.</p>
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
