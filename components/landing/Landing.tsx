"use client";

import Link from "next/link";
import { useI18n } from "@/components/providers/I18nProvider";
import { Icon } from "@/components/ui/Icon";

interface LandingProps {
  stats: {
    topicsCount: number;
    roomsCount: number;
    membersCount: number;
  };
}

export function Landing({ stats }: LandingProps) {
  const { t, locale } = useI18n();

  return (
    <div className="relative overflow-hidden bg-[#070709] text-text-primary min-h-screen flex flex-col justify-between selection:bg-accent/30 selection:text-white">
      {/* Premium Ambient Background Mesh Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Minimal Top Navbar */}
      <nav className="flex items-center justify-between px-6 py-5 sm:px-10 max-w-7xl mx-auto w-full border-b border-white/[0.04]">
        <Link href="/" className="text-lg font-display font-bold tracking-tight text-white flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span className="h-6 w-6 rounded-btn bg-gradient-to-tr from-accent to-indigo-500 flex items-center justify-center text-xs font-black text-white shadow-md shadow-accent/20">O</span>
          Oroya
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-btn px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-white"
          >
            {t("nav.signIn")}
          </Link>
          <Link
            href="/register"
            className="btn-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-accent/15 hover:shadow-accent/25"
          >
            {t("nav.signUp")}
          </Link>
        </div>
      </nav>

      <div className="container-app relative py-12 sm:py-20 lg:py-24 flex-1 max-w-5xl mx-auto px-6">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-medium text-accent animate-fade-in shadow-sm">
            <Icon name="star" size={12} />
            {t("landing.badge")}
          </span>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.1] [text-wrap:balance]">
            {t("landing.heroTitle")}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-text-secondary sm:text-lg md:text-xl font-normal leading-relaxed">
            {t("landing.heroSubtitle")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center w-full sm:w-auto">
            <Link href="/register" className="btn-primary px-6 py-2.5 text-sm shadow-xl shadow-accent/25 hover:shadow-accent/40 transition-all font-semibold flex items-center justify-center gap-1.5 hover:-translate-y-0.5 duration-150">
              {t("landing.heroCta")}
              <Icon name="chevron-right" size={14} />
            </Link>
            <Link href="/explore" className="btn-secondary px-6 py-2.5 text-sm font-medium flex items-center justify-center hover:-translate-y-0.5 duration-150">
              {t("landing.heroCtaSecondary")}
            </Link>
          </div>
          <p className="mt-4 text-xs text-text-secondary/50 font-mono">
            {t("landing.heroNote")}
          </p>

          <div className="mt-16 w-full rounded-md border border-white/[0.08] bg-black p-2 shadow-2xl">
            <div className="relative overflow-hidden rounded-md bg-[#0a0a0a] ring-1 ring-white/[0.05]">
              <div className="flex items-center justify-between border-b border-white/[0.05] bg-black px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
                </div>
                <div className="rounded border border-white/[0.05] bg-white/[0.02] px-3 py-0.5 text-xs text-text-secondary font-mono tracking-wider">
                  oroya.xyz/topics/saas-architecture
                </div>
                <div className="w-12" />
              </div>

              {/* Mockup Content */}
              <div className="p-4 sm:p-6 text-left">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center font-bold text-accent text-xs">
                    OM
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <span className="font-semibold text-text-primary">@mertdemir</span>
                      <span>·</span>
                      <span>{locale === "tr" ? "10dk önce" : "10m ago"}</span>
                      <span className="rounded-badge bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">Architecture</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-white sm:text-lg">
                      {t("landing.mockupTitle")}
                    </h3>
                  </div>
                </div>

                <div className="mt-3 pl-12 text-sm text-text-secondary space-y-3">
                  <p className="leading-relaxed">
                    {t("landing.mockupDesc")}
                  </p>
                  <div className="rounded-card border border-white/[0.05] bg-[#0c0c0f] p-4 font-mono text-xs text-accent space-y-1 overflow-x-auto scrollbar-thin">
                    <div><span className="text-[#ff79c6]">CREATE SCHEMA</span> tenant_company_a;</div>
                    <div><span className="text-[#ff79c6]">SET search_path TO</span> tenant_company_a;</div>
                    <div><span className="text-[#8be9fd]">CREATE TABLE</span> users (id <span className="text-[#50fa7b]">UUID PRIMARY KEY</span>, name <span className="text-[#f1fa8c]">VARCHAR</span>);</div>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/[0.05] pt-4 pl-12 space-y-4">
                  <div className="flex gap-2.5">
                    <div className="h-6 w-6 rounded-full bg-success/15 border border-success/25 flex items-center justify-center font-bold text-success text-[10px]">
                      AG
                    </div>
                    <div className="min-w-0 flex-1 bg-white/[0.02] rounded-card p-3.5 border border-white/[0.04]">
                      <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                        <span className="font-semibold text-text-primary">@antigravity</span>
                        <span>·</span>
                        <span>{locale === "tr" ? "5dk önce" : "5m ago"}</span>
                      </div>
                      <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                        {t("landing.mockupReply")}
                      </p>
                      <div className="mt-2.5 flex items-center gap-3 text-[10px] text-text-secondary">
                        <span className="flex items-center gap-1 cursor-pointer hover:text-accent"><Icon name="arrow-up" size={10} /> 12</span>
                        <span className="cursor-pointer hover:text-accent font-semibold">{locale === "tr" ? "Yanıtla" : "Reply"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Minimal Stats Bar */}
        <section className="mt-16 border-y border-white/[0.05] py-8 sm:mt-24">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">{stats.topicsCount || 12}</p>
              <p className="mt-1 text-[10px] sm:text-xs uppercase tracking-widest text-text-secondary font-mono">{t("landing.statsTopics")}</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">{stats.roomsCount || 4}</p>
              <p className="mt-1 text-[10px] sm:text-xs uppercase tracking-widest text-text-secondary font-mono">{t("landing.statsRooms")}</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">{stats.membersCount || 8}</p>
              <p className="mt-1 text-[10px] sm:text-xs uppercase tracking-widest text-text-secondary font-mono">{t("landing.statsMembers")}</p>
            </div>
          </div>
        </section>

        {/* Core Features Grid */}
        <section className="mt-20 sm:mt-28">
          <div className="text-center">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-accent font-mono">
              {t("landing.featuresEyebrow")}
            </h2>
            <p className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {t("landing.featuresTitle")}
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm text-text-secondary leading-relaxed">
              {t("landing.featuresSubtitle")}
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon="chat"
              title={t("landing.feature1Title")}
              description={t("landing.feature1Desc")}
            />
            <FeatureCard
              icon="edit"
              title={t("landing.feature2Title")}
              description={t("landing.feature2Desc")}
            />
            <FeatureCard
              icon="rooms"
              title={t("landing.feature3Title")}
              description={t("landing.feature3Desc")}
            />
          </div>
        </section>

        {/* Clean Comparison Matrix */}
        <section className="mt-20 sm:mt-28">
          <div className="text-center mb-10">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-accent font-mono">
              {t("landing.comparisonEyebrow")}
            </h2>
            <p className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {t("landing.comparisonTitle")}
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm text-text-secondary leading-relaxed">
              {t("landing.comparisonSubtitle")}
            </p>
          </div>

          <div className="overflow-x-auto rounded-md border border-white/[0.08] bg-black shadow-xl">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02] text-white">
                  <th className="p-4 font-mono font-semibold text-text-secondary uppercase tracking-widest text-[10px] w-1/3">
                    {locale === "tr" ? "Özellik" : "Feature"}
                  </th>
                  <th className="p-4 font-semibold text-text-secondary/70">{t("landing.colTwitter")}</th>
                  <th className="p-4 font-semibold text-accent flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                    {t("landing.colOroya")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-text-secondary">
                <ComparisonRow label={t("landing.rowLifespan")} bad={t("landing.rowLifespanTw")} good={t("landing.rowLifespanOy")} />
                <ComparisonRow label={t("landing.rowSearch")} bad={t("landing.rowSearchTw")} good={t("landing.rowSearchOy")} />
                <ComparisonRow label={t("landing.rowFormat")} bad={t("landing.rowFormatTw")} good={t("landing.rowFormatOy")} />
                <ComparisonRow label={t("landing.rowDiscussion")} bad={t("landing.rowDiscussionTw")} good={t("landing.rowDiscussionOy")} />
                <ComparisonRow label={t("landing.rowOwnership")} bad={t("landing.rowOwnershipTw")} good={t("landing.rowOwnershipOy")} />
              </tbody>
            </table>
          </div>
        </section>

        {/* Minimal Final Callout Card */}
        <section className="mt-20 rounded-md border border-white/[0.08] bg-gradient-to-b from-white/[0.02] to-transparent p-8 sm:mt-28 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
            {t("landing.ctaTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-text-secondary leading-relaxed">
            {t("landing.ctaSubtitle")}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 justify-center sm:flex-row">
            <Link href="/register" className="btn-primary px-6 py-2.5">
              {t("landing.ctaButton")}
            </Link>
            <Link href="/login" className="text-xs font-semibold text-text-secondary hover:text-white transition-colors">
              {t("landing.ctaLogin")}
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8 bg-black/[0.15]">
        <div className="mx-auto max-w-5xl px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-secondary/40 font-mono">
            &copy; {new Date().getFullYear()} Oroya. {t("footer.copyright") || "All rights reserved."}
          </p>
          <p className="text-xs text-text-secondary/50 font-mono">
            {t("landing.footerTagline")}
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: "chat" | "edit" | "rooms";
  title: string;
  description: string;
}) {
  return (
    <div className="relative flex flex-col gap-3 rounded-card border border-white/[0.05] bg-white/[0.01] p-6 hover:border-accent/30 hover:bg-white/[0.02] transition-all duration-200 shadow-sm group">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-btn bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-200">
        <Icon name={icon} size={16} />
      </div>
      <h3 className="font-display text-base font-bold text-white tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-text-secondary leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function ComparisonRow({ label, bad, good }: { label: string; bad: string; good: string }) {
  return (
    <tr className="hover:bg-white/[0.01] transition-colors">
      <td className="p-4 font-medium text-white text-xs sm:text-sm">{label}</td>
      <td className="p-4 text-xs font-mono opacity-60">{bad}</td>
      <td className="p-4 text-xs font-semibold text-white">{good}</td>
    </tr>
  );
}
