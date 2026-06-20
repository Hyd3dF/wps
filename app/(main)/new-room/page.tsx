"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/providers/I18nProvider";

export default function NewRoomPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [maxMembers, setMaxMembers] = useState<number | "">("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [errors, setErrors] = useState<{ name?: string; description?: string; maxMembers?: string }>({});
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

  const addTag = () => {
    const tInput = tagInput
      .trim()
      .toLowerCase()
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
    const nextErrs: typeof errors = {};
    if (name.trim().length < 3) nextErrs.name = "Room name must be at least 3 characters";
    if (description.trim().length < 10) nextErrs.description = "Description must be at least 10 characters";
    if (maxMembers !== "" && (maxMembers < 2 || maxMembers > 10000)) nextErrs.maxMembers = "Max members must be between 2 and 10000";

    setErrors(nextErrs);
    if (Object.keys(nextErrs).length > 0) return;

    setSubmitting(true);
    setApiError("");
    try {
      const response = await fetch("/api/backend/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name.trim(), 
          description: description.trim(), 
          isPrivate,
          tags,
          welcomeMessage: welcomeMessage.trim() || undefined,
          maxMembers: maxMembers !== "" ? maxMembers : undefined
        }),
      });
      const data = await response.json().catch(() => null) as
        | { room?: { slug: string }; error?: { message?: string } }
        | null;
      if (!response.ok || !data?.room) throw new Error(data?.error?.message || "Failed to create room");
      router.push(`/rooms/${data.room.slug}`);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Failed to create room");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center gap-3">
        <Icon name="rooms" size={24} className="text-accent" />
        <h1 className="text-2xl font-display font-bold tracking-tight text-white">
          Create New Room
        </h1>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-6">
        {/* Basic Info Section */}
        <div className="flex flex-col gap-5 border border-border bg-bg-secondary/30 rounded-lg p-5">
          <h2 className="text-[14px] font-bold text-white mb-2">Basic Information</h2>
          <div>
            <label htmlFor="room-name" className="mb-2 block text-[13px] font-semibold text-text-secondary/90">
              Room Name
            </label>
            <input
              id="room-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rust Enthusiasts"
              maxLength={64}
              className="w-full bg-bg-secondary border border-border rounded-lg px-4 py-2.5 text-[14px] text-white placeholder:text-text-secondary/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all"
            />
            <div className="mt-1.5 flex items-center justify-between text-[11px]">
              {errors.name ? (
                <span className="text-danger">{errors.name}</span>
              ) : (
                <span className="text-text-secondary">
                  Slug: <span className="font-mono text-text-primary">/{slugPreview || "room-name"}</span>
                </span>
              )}
              <span className="tabular-nums text-text-secondary">{name.length}/64</span>
            </div>
          </div>

          <div>
            <label htmlFor="room-desc" className="mb-2 block text-[13px] font-semibold text-text-secondary/90">
              Description
            </label>
            <textarea
              id="room-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this room about?"
              maxLength={200}
              className="w-full min-h-[80px] resize-y bg-bg-secondary border border-border rounded-lg px-4 py-2.5 text-[14px] text-white placeholder:text-text-secondary/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all"
            />
            <div className="mt-1.5 flex items-center justify-between text-[11px]">
              {errors.description ? (
                <span className="text-danger">{errors.description}</span>
              ) : (
                <span className="text-text-secondary">Provide a clear description of the room's purpose.</span>
              )}
              <span className="tabular-nums text-text-secondary">{description.length}/200</span>
            </div>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="flex flex-col gap-5 border border-border bg-bg-secondary/30 rounded-lg p-5">
          <h2 className="text-[14px] font-bold text-white mb-2">Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="mb-2 block text-[13px] font-semibold text-text-secondary/90">
                Max Members (Optional)
              </label>
              <input
                type="number"
                value={maxMembers}
                onChange={(e) => setMaxMembers(e.target.value ? parseInt(e.target.value, 10) : "")}
                placeholder="Unlimited"
                min={2}
                max={10000}
                className="w-full bg-bg-secondary border border-border rounded-lg px-4 py-2.5 text-[14px] text-white placeholder:text-text-secondary/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all"
              />
              {errors.maxMembers && <p className="mt-1.5 text-[11px] text-danger">{errors.maxMembers}</p>}
            </div>

            <div>
              <label className="mb-2 block text-[13px] font-semibold text-text-secondary/90">
                Tags (Up to 5)
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
                    placeholder={tags.length === 0 ? "add tags..." : ""}
                    className="flex-1 min-w-[100px] bg-transparent text-[13px] text-white placeholder:text-text-secondary/60 focus:outline-none px-2 py-0.5"
                  />
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-semibold text-text-secondary/90">
              Welcome Message (Optional)
            </label>
            <textarea
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              placeholder="Send a welcome message to new members..."
              maxLength={300}
              className="w-full min-h-[60px] resize-y bg-bg-secondary border border-border rounded-lg px-4 py-2.5 text-[14px] text-white placeholder:text-text-secondary/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all"
            />
          </div>

          <div className="flex items-center justify-between border-t border-border pt-5 mt-2">
            <div>
              <p className="text-[13px] font-bold text-white">Private Room</p>
              <p className="text-[12px] text-text-secondary">
                Only people with an invite link can join.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isPrivate}
              onClick={() => setIsPrivate((p) => !p)}
              className={cn(
                "relative h-5 w-9 rounded-full transition-colors",
                isPrivate ? "bg-accent" : "bg-bg-tertiary",
              )}
            >
              <span
                className={cn(
                  "absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white transition-transform",
                  isPrivate ? "translate-x-4" : "translate-x-0",
                )}
              />
            </button>
          </div>
        </div>

        {apiError && <p role="alert" className="text-[13px] text-danger font-medium">{apiError}</p>}

        <div className="flex items-center justify-end gap-4 mt-2">
          <button type="button" onClick={() => router.back()} className="text-[13px] font-semibold text-text-secondary hover:text-white transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-primary rounded-full px-8 py-2.5 shadow-accent/20">
            <Icon name="plus" size={16} />
            {submitting ? "Creating..." : "Create Room"}
          </button>
        </div>
      </form>
    </div>
  );
}
