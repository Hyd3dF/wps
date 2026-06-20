"use client";

import React, { useState, useEffect, useRef } from "react";
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

const SIMULATED_CHAT_TR = [
  { sender: "can_dev", name: "Can Aksoy", avatar: "CA", role: "developer", text: "Production veritabanında CPU kullanımı aniden %95'e fırladı. İşlemleri inceleyen var mı?", time: "14:02" },
  { sender: "asli_ops", name: "Aslı Yılmaz", avatar: "AY", role: "devops", text: "Logları kontrol ediyorum. Son yapılan PR'da `saves` tablosundaki `topic_id` kolonu için indeks eklenmemiş gibi duruyor.", time: "14:03" },
  { sender: "system", name: "SYSTEM ALERT", avatar: "🚨", role: "system", text: "Uyarı: Veritabanı CPU kullanımı kritik seviyede (%98).", time: "14:03" },
  { sender: "mertdemir", name: "Mert Demir", avatar: "MD", role: "tech-lead", text: "Hemen hızlıca eksik indeksi ekleyen bir migration yazıp uyguluyorum. 2 dakikaya düzelir.", time: "14:04" },
  { sender: "asli_ops", name: "Aslı Yılmaz", avatar: "AY", role: "devops", text: "Harika olur Mert. Sonucu buradan paylaşabilir misin?", time: "14:04" },
  { sender: "mertdemir", name: "Mert Demir", avatar: "MD", role: "tech-lead", text: "Migration uygulandı, `idx_saves_topic_id` indeksi başarıyla oluşturuldu.", time: "14:05" },
  { sender: "system", name: "SYSTEM DEPLOY", avatar: "🤖", role: "system", text: "Hotfix #812 başarıyla deploy edildi.", time: "14:05" },
  { sender: "can_dev", name: "Can Aksoy", avatar: "CA", role: "developer", text: "CPU kullanımı anlık olarak %4 seviyesine düştü. Sorun çözüldü, eline sağlık Mert!", time: "14:06" }
];

const SIMULATED_CHAT_EN = [
  { sender: "can_dev", name: "Alex Rivera", avatar: "AR", role: "developer", text: "Production database CPU usage spiked to 95%! Anyone investigating?", time: "14:02" },
  { sender: "asli_ops", name: "Elena Rostova", avatar: "ER", role: "devops", text: "Checking logs now. Looks like the recent PR is missing an index on the `saves.topic_id` column.", time: "14:03" },
  { sender: "system", name: "SYSTEM ALERT", avatar: "🚨", role: "system", text: "Alert: Database CPU utilization is critical (98%).", time: "14:03" },
  { sender: "mertdemir", name: "Mert Demir", avatar: "MD", role: "tech-lead", text: "I'll write a quick migration to add the missing index and apply it. Should be fixed in 2 mins.", time: "14:04" },
  { sender: "asli_ops", name: "Elena Rostova", avatar: "ER", role: "devops", text: "Awesome. Keep us posted here.", time: "14:04" },
  { sender: "mertdemir", name: "Mert Demir", avatar: "MD", role: "tech-lead", text: "Migration applied. Index `idx_saves_topic_id` created successfully.", time: "14:05" },
  { sender: "system", name: "SYSTEM DEPLOY", avatar: "🤖", role: "system", text: "Hotfix #812 deployed successfully.", time: "14:05" },
  { sender: "can_dev", name: "Alex Rivera", avatar: "AR", role: "developer", text: "CPU usage dropped back to 4%! Problem solved, nice work Mert!", time: "14:06" }
];

const INITIAL_COMMENTS = [
  { id: "c1", author: "can_dev", rep: 128, avatar: "CA", body: "", time: "", depth: 1 },
  { id: "c2", author: "mertdemir", rep: 342, avatar: "MD", body: "", time: "", depth: 2 }
];

const COMMENT_TEMPLATES = {
  tr: {
    c1: "Biz de benzer bir yapı kurduk ama cold-start sürelerinde hafif bir artış gözlemledik. max limitini 2 veya 3 yapmak cold-start yükünü rahatlatabilir.",
    c2: "Çok doğru Can. Trafik pattern'ine göre max: 2 serverless için en güvenli liman."
  },
  en: {
    c1: "We set up something similar but saw a slight increase in cold-start times. Lowering max pool size to 2 or 3 helped reduce connection initialization overhead.",
    c2: "Spot on. Depending on traffic patterns, max: 2 is often the safest sweet spot for serverless environments."
  }
};

export function Landing({ stats }: LandingProps) {
  const { t, locale } = useI18n();
  const [activeTab, setActiveTab] = useState<"topics" | "rooms" | "profile">("topics");

  // Topic Mockup State
  const [votes, setVotes] = useState(148);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [mockComments, setMockComments] = useState(INITIAL_COMMENTS);

  const getCommentBody = (comment: typeof mockComments[0]) => {
    if (comment.id === "c1" || comment.id === "c2") {
      const dict = locale === "tr" ? COMMENT_TEMPLATES.tr : COMMENT_TEMPLATES.en;
      return dict[comment.id as keyof typeof COMMENT_TEMPLATES.tr];
    }
    return comment.body;
  };

  const getCommentTime = (comment: typeof mockComments[0]) => {
    if (comment.id === "c1") return locale === "tr" ? "10dk önce" : "10m ago";
    if (comment.id === "c2") return locale === "tr" ? "5dk önce" : "5m ago";
    return comment.time;
  };

  const handleVote = () => {
    if (hasUpvoted) {
      setVotes((prev) => prev - 1);
      setHasUpvoted(false);
    } else {
      setVotes((prev) => prev + 1);
      setHasUpvoted(true);
    }
  };

  const submitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const newComment = {
      id: "custom-" + Date.now(),
      author: "you",
      rep: 1,
      avatar: "YO",
      body: replyText,
      time: locale === "tr" ? "Şimdi" : "Just now",
      depth: 3
    };
    setMockComments((prev) => [...prev, newComment]);
    setReplyText("");
    setIsReplying(false);
  };

  // Profile Activity Grid
  const gridCells = Array.from({ length: 22 * 7 }).map((_, i) => {
    const hash = (i * 23 + 11) % 7;
    if (hash > 4) return 0;
    return hash;
  });

  return (
    <div className="relative overflow-hidden bg-[#070709] text-text-primary min-h-screen flex flex-col justify-between selection:bg-accent/30 selection:text-white">
      {/* Premium Ambient Background Mesh Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-accent/5 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: "10s" }} />

      {/* Sticky Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-black/60 backdrop-blur-md transition-all">
        <nav className="flex items-center justify-between px-6 py-4 sm:px-10 max-w-7xl mx-auto w-full">
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
      </header>

      <div className="container-app relative py-12 sm:py-20 lg:py-24 flex-1 max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/5 px-3 py-1.5 text-xs font-semibold text-accent animate-fade-in shadow-sm tracking-wide">
            <Icon name="star" size={12} />
            {t("landing.badge")}
          </span>
          <h1 className="mt-6 max-w-4xl font-display text-4xl font-black tracking-tight sm:tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/80 sm:text-6xl md:text-7xl leading-[1.05] [text-wrap:balance]">
            {t("landing.heroTitle")}
          </h1>
          <p className="mt-6 max-w-2xl text-base text-text-secondary sm:text-lg md:text-xl font-normal leading-relaxed">
            {t("landing.heroSubtitle")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center w-full sm:w-auto">
            <Link href="/register" className="btn-primary px-8 py-3 text-sm shadow-xl shadow-accent/15 hover:shadow-accent/30 transition-all font-semibold flex items-center justify-center gap-2 hover:-translate-y-0.5 duration-150">
              {t("landing.heroCta")}
              <Icon name="chevron-right" size={14} />
            </Link>
            <button 
              onClick={() => {
                const element = document.getElementById("live-demo-showcase");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-secondary px-8 py-3 text-sm font-medium flex items-center justify-center hover:-translate-y-0.5 duration-150"
            >
              {t("landing.heroCtaSecondary")}
            </button>
          </div>
          <p className="mt-4 text-xs text-text-secondary/50 font-mono">
            {t("landing.heroNote")}
          </p>

          {/* Monochromatic Developer Tool Logos (Social Proof) */}
          <div className="mt-16 sm:mt-24 flex flex-col items-center gap-4">
            <p className="text-[10px] uppercase tracking-widest text-text-secondary/50 font-mono font-bold">
              {t("landing.trustText")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-35 hover:opacity-55 transition-opacity duration-300">
              <div className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z" />
                </svg>
                <span className="font-mono text-sm font-semibold tracking-tighter">GitHub</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 76 65" fill="currentColor">
                  <polygon points="38 0, 76 65, 0 65" />
                </svg>
                <span className="font-mono text-sm font-semibold tracking-tighter">Vercel</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors">
                <svg className="w-4.5 h-4.5" viewBox="0 0 96 96" fill="none">
                  <path d="M56 8L16 52h32v36L88 44H56V8z" fill="currentColor" />
                </svg>
                <span className="font-mono text-sm font-semibold tracking-tighter">Supabase</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 2h20v4H2V2zm0 8h20v4H2v-4zm0 8h20v4H2v-4z" />
                </svg>
                <span className="font-mono text-sm font-semibold tracking-tighter">Railway</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 22h20L12 2zM12 6.5l6.5 12.5H5.5L12 6.5z" />
                </svg>
                <span className="font-mono text-sm font-semibold tracking-tighter">Prisma</span>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Live Product Showcase (Canlı Demo) */}
        <section id="live-demo-showcase" className="mt-24 sm:mt-32 scroll-mt-24">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent font-mono">
              {t("landing.showcaseEyebrow")}
            </span>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-white sm:text-5xl">
              {t("landing.showcaseTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-text-secondary leading-relaxed">
              {t("landing.showcaseSubtitle")}
            </p>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex items-center justify-center gap-2 border-b border-white/[0.06] pb-px mb-8 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab("topics")}
              className={`flex-1 pb-3 text-sm font-semibold transition-all relative ${
                activeTab === "topics"
                  ? "text-accent border-b-2 border-accent"
                  : "text-text-secondary hover:text-white"
              }`}
            >
              {t("landing.tabTopics")}
            </button>
            <button
              onClick={() => setActiveTab("rooms")}
              className={`flex-1 pb-3 text-sm font-semibold transition-all relative ${
                activeTab === "rooms"
                  ? "text-accent border-b-2 border-accent"
                  : "text-text-secondary hover:text-white"
              }`}
            >
              {t("landing.tabRooms")}
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 pb-3 text-sm font-semibold transition-all relative ${
                activeTab === "profile"
                  ? "text-accent border-b-2 border-accent"
                  : "text-text-secondary hover:text-white"
              }`}
            >
              {t("landing.tabProfile")}
            </button>
          </div>

          {/* Simulated Browser Workspace Container */}
          <div className="w-full rounded-lg border border-white/[0.08] bg-[#0c0c0f] shadow-2xl overflow-hidden transition-all duration-300">
            {/* Window Chrome Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#09090b] px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-white/10" />
                <div className="h-3 w-3 rounded-full bg-white/10" />
                <div className="h-3 w-3 rounded-full bg-white/10" />
              </div>
              <div className="rounded border border-white/[0.05] bg-white/[0.02] px-6 py-1 text-xs text-text-secondary font-mono tracking-wide max-w-[280px] sm:max-w-md truncate">
                {activeTab === "topics" && "oroya.xyz/topics/postgres-connection-pooling"}
                {activeTab === "rooms" && "oroya.xyz/rooms/production-incident"}
                {activeTab === "profile" && "oroya.xyz/u/mertdemir"}
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] text-text-secondary/70 font-mono uppercase tracking-wider">{locale === "tr" ? "Canlı" : "Live"}</span>
              </div>
            </div>

            {/* Display active tab mockup */}
            <div className="p-4 sm:p-6 min-h-[460px] flex flex-col justify-between">
              
              {/* TAB 1: TOPICS MOCKUP */}
              {activeTab === "topics" && (
                <div className="space-y-6 text-left animate-fade-in flex-1">
                  <div className="flex items-start gap-4">
                    <div className="h-9 w-9 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent text-xs">
                      MD
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <span className="font-semibold text-text-primary">@mertdemir</span>
                        <span>·</span>
                        <span>{locale === "tr" ? "3dk önce" : "3m ago"}</span>
                        <span>·</span>
                        <span className="rounded bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">Startup</span>
                      </div>
                      <h3 className="mt-1 font-display text-lg font-bold text-white sm:text-xl tracking-tight leading-snug">
                        Optimizing PostgreSQL Connection Pool in Serverless (Next.js) Functions
                      </h3>
                    </div>
                  </div>

                  <div className="pl-12 sm:pl-13 space-y-4">
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {locale === "tr" 
                        ? "Serverless function'lar ölçeklendikçe PostgreSQL connection limitlerine çarpıyorduk. Her API çağrısında yeni client yaratmak veritabanını tüketiyordu. Çözüm olarak global caching ve pooling parametrelerini şu şekilde ayarladık:" 
                        : "As serverless functions scale, they spawn too many database connections, quickly hitting limits. We solved it by caching the Pool client globally in Node.js:"}
                    </p>

                    <div className="rounded-md border border-white/[0.06] bg-[#050507] p-4 font-mono text-[11px] sm:text-xs text-emerald-400 space-y-1 overflow-x-auto scrollbar-thin">
                      <div><span className="text-[#ff79c6]">import</span> &#123; Pool &#125; <span className="text-[#ff79c6]">from</span> <span className="text-[#f1fa8c]">&apos;pg&apos;</span>;</div>
                      <div><span className="text-[#ff79c6]">let</span> pool: Pool;</div>
                      <div><span className="text-[#ff79c6]">if</span> (!global.pgPool) &#123;</div>
                      <div>&nbsp;&nbsp;global.pgPool = <span className="text-[#ff79c6]">new</span> <span className="text-[#50fa7b]">Pool</span>(&#123;</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;connectionString: process.env.DATABASE_URL,</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;max: <span className="text-[#bd93f9]">3</span>, <span className="text-[#6272a4]">{`// Tiny pool size per serverless instance`}</span></div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;idleTimeoutMillis: <span className="text-[#bd93f9]">10000</span></div>
                      <div>&nbsp;&nbsp;&#125;);</div>
                      <div>&#125;</div>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-1.5 flex-wrap">
                      <span className="rounded bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 text-[10px] font-semibold text-text-secondary">#postgresql</span>
                      <span className="rounded bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 text-[10px] font-semibold text-text-secondary">#nextjs</span>
                      <span className="rounded bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 text-[10px] font-semibold text-text-secondary">#serverless</span>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center gap-4 pt-2 border-t border-white/[0.04]">
                      <button
                        onClick={handleVote}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded transition-all ${
                          hasUpvoted 
                            ? "bg-accent/15 text-accent shadow-sm border border-accent/25" 
                            : "hover:bg-white/[0.04] text-text-secondary border border-transparent"
                        }`}
                      >
                        <Icon name="arrow-up" size={14} className={hasUpvoted ? "scale-110" : ""} />
                        <span>{votes}</span>
                      </button>
                      <button 
                        onClick={() => setIsReplying(!isReplying)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-white px-2 py-1 rounded hover:bg-white/[0.04]"
                      >
                        <Icon name="chat" size={14} />
                        <span>{mockComments.length} {locale === "tr" ? "Yorum" : "Comments"}</span>
                      </button>
                    </div>

                    {/* Inline Reply Form */}
                    {isReplying && (
                      <form onSubmit={submitReply} className="mt-4 animate-slide-up space-y-2">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={locale === "tr" ? "Teknik bir cevap yazın veya katkıda bulunun..." : "Write a constructive technical reply..."}
                          className="w-full rounded border border-white/[0.08] bg-[#09090b] p-3 text-xs text-text-primary focus:border-accent focus:outline-none placeholder:text-text-secondary/45"
                          rows={3}
                          autoFocus
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setIsReplying(false)}
                            className="px-3 py-1.5 text-[11px] font-semibold text-text-secondary hover:text-white rounded"
                          >
                            {locale === "tr" ? "İptal" : "Cancel"}
                          </button>
                          <button
                            type="submit"
                            className="bg-accent hover:bg-accent-hover text-white px-4 py-1.5 text-[11px] font-semibold rounded shadow shadow-accent/10"
                          >
                            {locale === "tr" ? "Yayınla" : "Publish"}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Interactive Nested Comments */}
                    <div className="space-y-4 border-t border-white/[0.04] pt-4">
                      {mockComments.map((comment) => (
                        <div 
                          key={comment.id}
                          className={`flex gap-3 text-xs ${
                            comment.depth === 2 ? "pl-6 sm:pl-10 border-l border-white/[0.05] mt-3" : ""
                          } ${
                            comment.depth === 3 ? "pl-12 sm:pl-20 border-l border-accent/20 mt-3 animate-slide-up" : ""
                          }`}
                        >
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[9px] ${
                            comment.author === "you" 
                              ? "bg-accent text-white" 
                              : "bg-white/[0.06] border border-white/[0.08] text-text-secondary"
                          }`}>
                            {comment.avatar}
                          </div>
                          <div className="min-w-0 flex-1 bg-white/[0.01] rounded-card p-3 border border-white/[0.03]">
                            <div className="flex items-center gap-1.5 text-[10px] text-text-secondary">
                              <span className="font-semibold text-text-primary">@{comment.author}</span>
                              <span className="opacity-70">({comment.rep > 0 ? `+${comment.rep}` : "you"})</span>
                              <span>·</span>
                              <span>{getCommentTime(comment)}</span>
                            </div>
                            <p className="mt-1 text-xs text-text-secondary leading-relaxed font-normal">
                              {getCommentBody(comment)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ROOMS MOCKUP */}
              {activeTab === "rooms" && (
                <RoomsMockup key={`${locale}-${activeTab}`} locale={locale} />
              )}

              {/* TAB 3: PROFILE MOCKUP */}
              {activeTab === "profile" && (
                <div className="text-left animate-fade-in flex-1 flex flex-col md:flex-row gap-6">
                  
                  {/* Left: Mini Card details */}
                  <div className="flex-1 max-w-sm space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-accent to-indigo-500 flex items-center justify-center font-bold text-white text-base shadow shadow-accent/25 font-display">
                        MD
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-white">Mert Demir</h3>
                        <p className="text-xs text-text-secondary">@mertdemir</p>
                        <span className="inline-block mt-1 text-[10px] font-mono font-bold text-accent bg-accent/10 border border-accent/15 px-2 py-0.5 rounded">
                          +1,420 rep
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed font-normal">
                      {locale === "tr" 
                        ? "Trendyol bünyesinde Senior Go & Node Developer. Boş zamanlarında SaaS geliştiriyor. Next.js, Postgres ve Docker aşığı."
                        : "Senior Go & Node Developer @ Trendyol. building indie SaaS on the side. Next.js, PostgreSQL and Docker enthusiast."}
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white/[0.02] border border-white/[0.05] p-2.5 rounded text-center">
                        <p className="text-xs text-text-secondary font-mono uppercase tracking-wider">{locale === "tr" ? "Konu" : "Topics"}</p>
                        <p className="text-sm font-bold text-white mt-0.5">32</p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/[0.05] p-2.5 rounded text-center">
                        <p className="text-xs text-text-secondary font-mono uppercase tracking-wider">{locale === "tr" ? "Yorum" : "Comments"}</p>
                        <p className="text-sm font-bold text-white mt-0.5">214</p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/[0.05] p-2.5 rounded text-center">
                        <p className="text-xs text-text-secondary font-mono uppercase tracking-wider">{locale === "tr" ? "Kaydetme" : "Saves"}</p>
                        <p className="text-sm font-bold text-white mt-0.5">86</p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Reputation Activity Grid */}
                  <div className="flex-1 space-y-4">
                    <span className="text-[10px] font-bold text-text-secondary/40 uppercase tracking-widest block">
                      {locale === "tr" ? "Katkı Geçmişi (Son 6 Ay)" : "Contribution History (Last 6 Months)"}
                    </span>

                    <div className="flex flex-col gap-3">
                      {/* Grid */}
                      <div className="grid grid-flow-col grid-rows-7 gap-1 bg-white/[0.02] p-4 rounded-md border border-white/[0.05] w-fit">
                        {gridCells.map((weight, idx) => {
                          const colorClass = 
                            weight === 0 ? "bg-white/[0.03]" :
                            weight === 1 ? "bg-accent/20" :
                            weight === 2 ? "bg-accent/45" :
                            weight === 3 ? "bg-accent/70" :
                            "bg-accent";
                          return (
                            <div 
                              key={idx} 
                              className={`h-2.5 w-2.5 rounded-sm ${colorClass} hover:scale-125 transition-transform duration-150 cursor-pointer`}
                              title={`Activity level: ${weight}`}
                            />
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-text-secondary/70">
                        <span>{locale === "tr" ? "Toplam 246 katkı" : "Total 246 contributions"}</span>
                        <div className="flex items-center gap-1.5">
                          <span>{locale === "tr" ? "Az" : "Less"}</span>
                          <span className="h-2 w-2 rounded-sm bg-white/[0.03]" />
                          <span className="h-2 w-2 rounded-sm bg-accent/20" />
                          <span className="h-2 w-2 rounded-sm bg-accent/45" />
                          <span className="h-2 w-2 rounded-sm bg-accent/70" />
                          <span className="h-2 w-2 rounded-sm bg-accent" />
                          <span>{locale === "tr" ? "Çok" : "More"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/[0.01] border border-white/[0.05] p-3 rounded text-xs space-y-2">
                      <p className="font-semibold text-text-primary flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {locale === "tr" ? "En Popüler Konu Başlığı" : "Most Popular Topic"}
                      </p>
                      <Link href="#" className="text-white hover:text-accent font-semibold block transition-colors leading-snug">
                        {locale === "tr" 
                          ? "SaaS Projelerinde Flyway ile Sıfır-Kesinti Veritabanı Migrations Yönetimi"
                          : "Zero-Downtime Database Migration Strategies in SaaS Applications using Flyway"}
                      </Link>
                      <div className="flex gap-3 text-[10px] text-text-secondary">
                        <span className="flex items-center gap-1"><Icon name="arrow-up" size={10} /> 182</span>
                        <span className="flex items-center gap-1"><Icon name="chat" size={10} /> 38</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        </section>

        {/* Minimal Stats Bar */}
        <section className="mt-20 border-y border-white/[0.05] py-10 sm:mt-28">
          <div className="grid grid-cols-3 gap-6 text-center max-w-4xl mx-auto">
            <div>
              <p className="text-3xl font-black text-white sm:text-4xl md:text-5xl tracking-tight">{stats.topicsCount || 148}</p>
              <p className="mt-2 text-[10px] sm:text-xs uppercase tracking-widest text-text-secondary/60 font-mono font-semibold">{t("landing.statsTopics")}</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white sm:text-4xl md:text-5xl tracking-tight">{stats.roomsCount || 12}</p>
              <p className="mt-2 text-[10px] sm:text-xs uppercase tracking-widest text-text-secondary/60 font-mono font-semibold">{t("landing.statsRooms")}</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white sm:text-4xl md:text-5xl tracking-tight">{stats.membersCount || 640}</p>
              <p className="mt-2 text-[10px] sm:text-xs uppercase tracking-widest text-text-secondary/60 font-mono font-semibold">{t("landing.statsMembers")}</p>
            </div>
          </div>
        </section>

        {/* Visual Before/After Section (Chaotic Twitter vs Structured Oroya) */}
        <section className="mt-24 sm:mt-32">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent font-mono">
              {t("landing.comparisonEyebrow")}
            </span>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-white sm:text-5xl">
              {t("landing.comparisonTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-text-secondary leading-relaxed">
              {t("landing.comparisonSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* The Noise Card */}
            <div className="relative rounded-lg border border-red-500/10 bg-[#090505]/40 p-6 flex flex-col justify-between hover:border-red-500/20 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-red-500/10">
                  <h3 className="font-display text-base font-bold text-red-400 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    {t("landing.noiseTitle")}
                  </h3>
                  <span className="rounded bg-red-500/10 border border-red-500/25 px-2 py-0.5 text-[9px] font-mono text-red-400 uppercase font-semibold">
                    {locale === "tr" ? "Gürültü" : "Noise"}
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed mb-6 font-normal">
                  {t("landing.noiseDesc")}
                </p>

                {/* Simulated Noise Feeds */}
                <div className="space-y-3 opacity-60">
                  <div className="bg-black/40 border border-white/[0.04] p-3 rounded text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 text-text-secondary font-mono text-[9px]">
                      <span>@ai_wrapper_guy</span> <span>1h</span>
                    </div>
                    <p className="text-text-secondary font-normal">Check out my new AI-powered wrapper tool! 🚀 Threads inside 👇 (1/14)</p>
                  </div>
                  <div className="bg-black/40 border border-red-500/5 p-3 rounded text-[11px] relative overflow-hidden">
                    <span className="absolute top-1 right-2 text-[8px] font-semibold text-text-secondary/40 uppercase tracking-widest font-mono">Sponsored Ad</span>
                    <p className="text-text-secondary/70 italic font-normal">Get 10,000 automated followers overnight with this new hack!</p>
                  </div>
                  <div className="bg-black/40 border border-white/[0.04] p-3 rounded text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 text-text-secondary font-mono text-[9px]">
                      <span>@tech_opinion</span> <span>3h</span>
                    </div>
                    <p className="text-text-secondary font-normal">Next.js App Router is absolute trash. Discuss.</p>
                    <div className="pl-3 border-l border-white/5 space-y-1 mt-2 text-[10px] text-text-secondary/80">
                      <div><span className="font-semibold text-text-primary">@fanboy:</span> L post, ratio</div>
                      <div><span className="font-semibold text-text-primary">@hater:</span> agreed, back to PHP</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* The Signal Card */}
            <div className="relative rounded-lg border border-accent/25 bg-[#08080f]/40 p-6 flex flex-col justify-between hover:border-accent/40 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-accent/[0.02] to-transparent pointer-events-none rounded-lg" />
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-accent/15">
                  <h3 className="font-display text-base font-bold text-accent flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    {t("landing.signalTitle")}
                  </h3>
                  <span className="rounded bg-accent/10 border border-accent/25 px-2 py-0.5 text-[9px] font-mono text-accent uppercase font-semibold">
                    {locale === "tr" ? "Sinyal" : "Signal"}
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed mb-6 font-normal">
                  {t("landing.signalDesc")}
                </p>

                {/* Simulated Signal Topics */}
                <div className="space-y-3">
                  <div className="bg-black/60 border border-white/[0.06] p-3 rounded text-[11px] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-text-secondary font-mono text-[9px]">
                        <span className="font-semibold text-text-primary">@mertdemir</span>
                        <span>·</span>
                        <span className="rounded bg-accent/10 px-1.5 py-0.2 text-[8px] text-accent">Database</span>
                      </div>
                      <span className="text-emerald-500 font-mono text-[9px] font-semibold">{locale === "tr" ? "Çözüldü" : "Solved"}</span>
                    </div>
                    <p className="text-white font-semibold text-xs tracking-tight">Managing Zero-Downtime PostgreSQL Schema Migrations in SaaS App</p>
                    <div className="flex items-center gap-3 text-[9px] text-text-secondary/70">
                      <span className="flex items-center gap-0.5"><Icon name="arrow-up" size={9} /> 84</span>
                      <span className="flex items-center gap-0.5"><Icon name="chat" size={9} /> 18 replies</span>
                    </div>
                  </div>
                  <div className="bg-black/60 border border-white/[0.06] p-3 rounded text-[11px] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-text-secondary font-mono text-[9px]">
                        <span className="font-semibold text-text-primary">@can_dev</span>
                        <span>·</span>
                        <span className="rounded bg-white/[0.04] px-1.5 py-0.2 text-[8px] text-text-secondary">Next.js</span>
                      </div>
                    </div>
                    <p className="text-white font-semibold text-xs tracking-tight">Best practices for caching fetches with Next.js 15 Fetch API</p>
                    <div className="flex items-center gap-3 text-[9px] text-text-secondary/70">
                      <span className="flex items-center gap-0.5"><Icon name="arrow-up" size={9} /> 62</span>
                      <span className="flex items-center gap-0.5"><Icon name="chat" size={9} /> 9 replies</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Developer Testimonials Grid (Social Proof) */}
        <section className="mt-24 sm:mt-32">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent font-mono">
              {t("landing.testimonialsEyebrow")}
            </span>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-white sm:text-5xl">
              {t("landing.testimonialsTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-text-secondary leading-relaxed">
              {t("landing.testimonialsSubtitle")}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            <TestimonialCard
              avatar="FA"
              name={t("landing.t1Name")}
              role={t("landing.t1Role")}
              quote={t("landing.t1Quote")}
            />
            <TestimonialCard
              avatar="SK"
              name={t("landing.t2Name")}
              role={t("landing.t2Role")}
              quote={t("landing.t2Quote")}
            />
            <TestimonialCard
              avatar="DK"
              name={t("landing.t3Name")}
              role={t("landing.t3Role")}
              quote={t("landing.t3Quote")}
            />
            <TestimonialCard
              avatar="MC"
              name={t("landing.t4Name")}
              role={t("landing.t4Role")}
              quote={t("landing.t4Quote")}
            />
          </div>
        </section>

        {/* Clean Call-to-Action Section */}
        <section className="mt-28 rounded-lg border border-white/[0.08] bg-gradient-to-b from-white/[0.02] to-transparent p-8 sm:mt-36 sm:p-14 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[150px] bg-accent/5 rounded-full blur-[80px] pointer-events-none -z-10" />
          <h2 className="font-display text-3xl font-black text-white sm:text-4xl tracking-tight">
            {t("landing.ctaTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base text-text-secondary leading-relaxed font-normal">
            {t("landing.ctaSubtitle")}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 justify-center sm:flex-row">
            <Link href="/register" className="btn-primary px-8 py-3 text-sm shadow-xl shadow-accent/15">
              {t("landing.ctaButton")}
            </Link>
            <Link href="/login" className="text-xs font-semibold text-text-secondary hover:text-white transition-colors">
              {t("landing.ctaLogin")}
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10 bg-[#040406]">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
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

function RoomsMockup({ locale }: { locale: string }) {
  const chatScript = locale === "tr" ? SIMULATED_CHAT_TR : SIMULATED_CHAT_EN;
  const [chatMessages, setChatMessages] = useState<any[]>(() => chatScript.slice(0, 2));
  const [chatIndex, setChatIndex] = useState(2);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatIndex >= chatScript.length) {
      const resetTimeout = setTimeout(() => {
        setChatMessages(chatScript.slice(0, 2));
        setChatIndex(2);
      }, 12000);
      return () => clearTimeout(resetTimeout);
    }

    const nextMsg = chatScript[chatIndex];
    const typingDuration = 1500;
    const idleDuration = 3500;

    const delayTimeout = setTimeout(() => {
      setTypingUser(nextMsg.name);
      const appendTimeout = setTimeout(() => {
        setTypingUser(null);
        setChatMessages((prev) => [...prev, nextMsg]);
        setChatIndex((prev) => prev + 1);
      }, typingDuration);
      return () => clearTimeout(appendTimeout);
    }, idleDuration);

    return () => clearTimeout(delayTimeout);
  }, [chatIndex, chatScript]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, typingUser]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 text-left animate-fade-in flex-1">
      {/* Left: Rooms Sidebar */}
      <div className="w-full sm:w-44 border-b sm:border-b-0 sm:border-r border-white/[0.05] pb-3 sm:pb-0 sm:pr-3 space-y-1">
        <span className="text-[10px] font-bold text-text-secondary/40 uppercase tracking-widest block pl-2 mb-2">
          {locale === "tr" ? "Odalar" : "Rooms"}
        </span>
        <button className="w-full text-left rounded px-2.5 py-1.5 text-xs text-text-secondary hover:text-white hover:bg-white/[0.03] transition-colors flex items-center gap-1.5">
          <span className="text-text-secondary/50">#</span> general
        </button>
        <button className="w-full text-left rounded px-2.5 py-1.5 text-xs font-semibold text-accent bg-accent/5 border border-accent/15 flex items-center justify-between">
          <span className="flex items-center gap-1.5"><span className="text-accent">#</span> production-incident</span>
          <span className="h-1.5 w-1.5 rounded-full bg-danger animate-ping" />
        </button>
        <button className="w-full text-left rounded px-2.5 py-1.5 text-xs text-text-secondary hover:text-white hover:bg-white/[0.03] transition-colors flex items-center gap-1.5">
          <span className="text-text-secondary/50">#</span> nextjs-15-migration
        </button>
      </div>

      {/* Center: Chat Stream */}
      <div className="flex-1 flex flex-col justify-between min-h-[360px] sm:min-h-[400px]">
        <div 
          ref={chatContainerRef}
          className="flex-1 max-h-[320px] overflow-y-auto space-y-3 pr-2 scrollbar-thin scroll-smooth"
        >
          {chatMessages.map((msg, index) => {
            const isSystem = msg.sender === "system";
            return (
              <div 
                key={index}
                className={`flex items-start gap-2.5 text-xs ${
                  isSystem ? "bg-white/[0.01] border border-white/[0.03] rounded p-2" : ""
                }`}
              >
                {!isSystem && (
                  <div className="h-7 w-7 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center font-bold text-[9px] text-accent font-mono">
                    {msg.avatar}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  {!isSystem ? (
                    <>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-semibold text-text-primary text-[11px]">@{msg.sender}</span>
                        <span className="text-[9px] text-text-secondary/50 font-mono">{msg.time}</span>
                      </div>
                      <p className="mt-0.5 text-text-secondary leading-relaxed text-xs font-normal">
                        {msg.text}
                      </p>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px]">{msg.avatar}</span>
                      <span className={`font-mono text-[10px] font-semibold uppercase tracking-wider ${
                        msg.text.includes("critical") || msg.text.includes("kritik") 
                          ? "text-danger" 
                          : "text-emerald-500"
                      }`}>
                        {msg.text}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {typingUser && (
            <div className="flex items-center gap-2 text-[10px] text-text-secondary/60 italic pl-10 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce" />
              <span>{typingUser} {locale === "tr" ? "yazıyor..." : "is typing..."}</span>
            </div>
          )}
        </div>

        {/* Chat Input simulator */}
        <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-accent flex items-center justify-center text-[9px] font-bold text-white font-mono">
            YO
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              disabled
              placeholder={locale === "tr" ? "production-incident odasına mesaj gönder..." : "Send a message to #production-incident..."}
              className="w-full rounded border border-white/[0.08] bg-[#09090b] px-3.5 py-1.5 text-xs text-text-primary placeholder:text-text-secondary/35 cursor-not-allowed"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <Icon name="send" size={12} className="text-text-secondary/40" />
            </div>
          </div>
        </div>
      </div>

      {/* Right: Room Members */}
      <div className="hidden lg:block w-36 border-l border-white/[0.05] pl-3 space-y-1">
        <span className="text-[10px] font-bold text-text-secondary/40 uppercase tracking-widest block pl-2 mb-2">
          {locale === "tr" ? "Üyeler" : "Members"} (3)
        </span>
        <div className="flex items-center gap-2 pl-2 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          <span className="text-xs text-text-secondary hover:text-white cursor-pointer truncate">@mertdemir</span>
        </div>
        <div className="flex items-center gap-2 pl-2 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          <span className="text-xs text-text-secondary hover:text-white cursor-pointer truncate">@asli_ops</span>
        </div>
        <div className="flex items-center gap-2 pl-2 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          <span className="text-xs text-text-secondary hover:text-white cursor-pointer truncate">@can_dev</span>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({
  avatar,
  name,
  role,
  quote,
}: {
  avatar: string;
  name: string;
  role: string;
  quote: string;
}) {
  return (
    <div className="rounded-lg border border-white/[0.05] bg-white/[0.01] p-5 hover:border-white/[0.1] hover:bg-white/[0.02] transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-[10px] font-bold text-accent font-mono">
            {avatar}
          </div>
          <div className="min-w-0">
            <h4 className="font-display text-xs font-bold text-white truncate">{name}</h4>
            <p className="text-[10px] text-text-secondary truncate">{role}</p>
          </div>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed font-normal italic">
          &ldquo;{quote}&rdquo;
        </p>
      </div>
    </div>
  );
}
