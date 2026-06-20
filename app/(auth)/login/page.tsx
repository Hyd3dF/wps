"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { useApp } from "@/components/providers/AppProvider";
import { useI18n } from "@/components/providers/I18nProvider";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.loginError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[360px] relative">
      <div className="mb-10 text-center flex flex-col items-center">
        <Logo className="justify-center mb-6 scale-125" showText={false} />
        <h1 className="text-[26px] font-display font-extrabold tracking-tight text-white">
          {t("auth.loginTitle")}
        </h1>
        <p className="mt-2 text-[14px] text-text-secondary/80 font-medium">
          {t("auth.loginSubtitle")}
        </p>
      </div>

      <form onSubmit={submit} className="card w-full sm:p-8 shadow-2xl shadow-black flex flex-col gap-5 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-50" />
        
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
              className="input pl-[38px] rounded-xl font-medium tracking-wide"
            />
          </div>
        </div>

        <div className="relative z-10">
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="password" className="text-[13px] font-semibold text-text-secondary">
              {t("auth.password")}
            </label>
            <button type="button" className="text-[12px] font-medium text-accent hover:text-white transition-colors">
              {t("auth.forgotPassword")}
            </button>
          </div>
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
              placeholder="••••••••"
              className="input pl-[38px] rounded-xl tracking-widest font-medium"
            />
          </div>
        </div>

        {error && (
          <div className="relative z-10 rounded-lg bg-danger/10 px-3 py-2 text-center text-[13px] font-medium text-danger border border-danger/20">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full rounded-xl h-[42px] mt-2 relative z-10">
          {loading ? t("auth.signingIn") : t("auth.signIn")}
        </button>
      </form>

      <p className="mt-8 text-center text-[13px] text-text-secondary/80 font-medium">
        {t("auth.noAccount")}{" "}
        <Link href="/register" className="text-white hover:text-accent transition-colors font-semibold">
          {t("auth.signUpLink")}
        </Link>
      </p>

    </div>
  );
}
