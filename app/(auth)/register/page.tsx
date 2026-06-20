"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { useApp } from "@/components/providers/AppProvider";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/providers/I18nProvider";

export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { register } = useApp();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = passwordStrength(password);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return;
    setError("");
    setLoading(true);
    try {
      await register({ displayName, username, email, password });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.registerError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] relative">
      <div className="mb-10 text-center flex flex-col items-center">
        <Logo className="justify-center mb-6 scale-125" showText={false} />
        <h1 className="text-[26px] font-display font-extrabold tracking-tight text-white">
          {t("auth.registerTitle")}
        </h1>
        <p className="mt-2 text-[14px] text-text-secondary/80 font-medium">
          {t("auth.registerSubtitle")}
        </p>
      </div>

      <form onSubmit={submit} className="card w-full sm:p-8 shadow-2xl shadow-black flex flex-col gap-5 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-50" />
        
        <div className="grid grid-cols-2 gap-4 relative z-10">
          <div>
            <label htmlFor="display" className="mb-2 block text-[13px] font-semibold text-text-secondary">
              {t("auth.displayName")}
            </label>
            <input
              id="display"
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ayhan Çınar"
              maxLength={64}
              className="input rounded-xl text-[13px] tracking-wide"
            />
          </div>

          <div>
            <label htmlFor="username" className="mb-2 block text-[13px] font-semibold text-text-secondary">
              {t("auth.username")}
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/60 text-[13px] font-medium">
                @
              </span>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                placeholder="ayhancn"
                maxLength={32}
                className="input pl-8 rounded-xl text-[13px] tracking-wide"
              />
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <label htmlFor="email" className="mb-2 block text-[13px] font-semibold text-text-secondary">
            {t("auth.email")}
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/60">
              <Icon name="mail" size={16} />
            </span>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sen@example.com"
              className="input pl-[38px] rounded-xl text-[13px] tracking-wide"
            />
          </div>
        </div>

        <div className="relative z-10">
          <label htmlFor="password" className="mb-2 block text-[13px] font-semibold text-text-secondary">
            {t("auth.password")}
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/60">
              <Icon name="lock" size={16} />
            </span>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("auth.passwordPlaceholder")}
              className="input pl-[38px] rounded-xl text-[13px] tracking-widest"
            />
          </div>
          {password && (
            <div className="mt-2.5 flex gap-1.5 px-1">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors duration-300",
                    i < strength.score
                      ? strength.color
                      : "bg-white/[0.05]",
                  )}
                />
              ))}
            </div>
          )}
        </div>

        <label className="relative z-10 mt-1 flex items-start gap-3 rounded-lg border border-white/[0.03] bg-white/[0.02] p-3 text-[12px] text-text-secondary/90 transition-colors hover:bg-white/[0.04]">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/[0.1] bg-black/40 accent-accent ring-offset-bg-secondary transition-colors"
          />
          <span className="leading-relaxed font-medium">
            {t("auth.acceptTermsPrefix")}
            <Link
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-accent transition-colors font-semibold mx-1"
            >
              {t("auth.termsLink")}
            </Link>
            {t("auth.acceptTermsSuffix")}
          </span>
        </label>

        {error && (
          <div className="relative z-10 rounded-lg bg-danger/10 px-3 py-2 text-center text-[13px] font-medium text-danger border border-danger/20">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading || !agree} className="btn-primary w-full rounded-xl h-[42px] mt-2 relative z-10 shadow-accent/20">
          {loading ? t("auth.creating") : t("auth.createAccount")}
        </button>
      </form>

      <p className="mt-8 text-center text-[13px] text-text-secondary/80 font-medium">
        {t("auth.haveAccount")}{" "}
        <Link href="/login" className="text-white hover:text-accent transition-colors font-semibold">
          {t("auth.signInLink")}
        </Link>
      </p>
    </div>
  );
}

function passwordStrength(pw: string): { score: number; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const colors = ["bg-[#ff5f56]", "bg-[#ffbd2e]", "bg-[#ffbd2e]", "bg-[#27c93f]"];
  return { score, color: colors[score - 1] ?? "bg-white/[0.05]" };
}
