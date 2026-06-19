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
  const { locale } = useI18n();
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
      setError(err instanceof Error ? err.message : "Kayıt oluşturulamadı");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <Logo className="justify-center" />
        <h1 className="mt-6 text-2xl font-display font-bold tracking-tight text-text-primary">
          Hesap oluştur
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Konu aç, tartış, itibar kazan.
        </p>
      </div>

      <form onSubmit={submit} className="card flex flex-col gap-4">
        <div>
          <label htmlFor="display" className="mb-1.5 block text-sm font-medium text-text-primary">
            Görünen ad
          </label>
          <input
            id="display"
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Ayhan Çınar"
            maxLength={64}
            className="input"
          />
        </div>

        <div>
          <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-text-primary">
            Kullanıcı adı
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
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
              className="input pl-7"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-primary">
            E-posta
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sen@example.com"
            className="input"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-text-primary">
            Şifre
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="en az 8 karakter"
            className="input"
          />
          {password && (
            <div className="mt-2 flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    i < strength.score
                      ? strength.color
                      : "bg-border",
                  )}
                />
              ))}
            </div>
          )}
        </div>

        <label className="flex items-start gap-2.5 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border bg-bg-tertiary accent-accent"
          />
          <span>
            {locale === "en" && "I accept the "}
            <Link
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Kullanım Şartları
            </Link>
            {locale === "tr" && <>&rsquo;nı kabul ediyorum.</>}
            {locale === "en" && "."}
          </span>
        </label>

        {error && <p role="alert" className="text-sm text-danger">{error}</p>}

        <button type="submit" disabled={loading || !agree} className="btn-primary w-full">
          {loading ? "Oluşturuluyor..." : "Hesabı Oluştur"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Zaten hesabın var mı?{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Giriş yap
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
  const colors = ["bg-danger", "bg-warning", "bg-warning", "bg-success"];
  return { score, color: colors[score - 1] ?? "bg-border" };
}
