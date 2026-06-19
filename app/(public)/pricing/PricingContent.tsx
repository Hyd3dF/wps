"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "yearly";

interface Plan {
  id: "free" | "pro" | "ultra";
  name: string;
  tagline: string;
  monthly: number;
  yearly: number;
  highlight?: boolean;
  badge?: string;
  features: string[];
  cta: string;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Topluluğa katıl, tartışmaya başla.",
    monthly: 0,
    yearly: 0,
    cta: "Ücretsiz Başla",
    features: [
      "Konu açma ve yorumlama",
      "Oy verme ve konu kaydetme",
      "Genel odalara katılım",
      "Markdown destekli içerik",
      "Topluluk keşfi ve arama",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Daha derin tartışmalar, daha fazla kontrol.",
    monthly: 9,
    yearly: 7,
    highlight: true,
    badge: "Popüler",
    cta: "Pro'ya Geç",
    features: [
      "Free'deki her şey",
      "Sınırsız konu ve yorum",
      "Reklamsız deneyim",
      "Öne çıkan konu rozeti",
      "Öncelikli oda erişimi",
      "5 GB dosya depolama",
      "Gelişmiş profil istatistikleri",
    ],
  },
  {
    id: "ultra",
    name: "Ultra",
    tagline: "Topluluk kurucuları ve power user'lar için.",
    monthly: 19,
    yearly: 15,
    badge: "En çok özellik",
    cta: "Ultra'ya Geç",
    features: [
      "Pro'daki her şey",
      "Konu ön plana çıkarma (boost)",
      "Sınırsız özel oda oluşturma",
      "Analitik panel",
      "Öncelikli destek yanıtı",
      "50 GB dosya depolama",
      "Ultra profil rozeti",
    ],
  },
];

const FAQ = [
  {
    q: "Ödemeler ne zaman aktifleşecek?",
    a: "Paddle üzerinden abonelik ödemeleri çok yakında açılacaktır. Bu sayfa, fiyatlandırmanın son halini gösterir; satın alma butonları ödeme altyapısı aktifleştiğinde çalışır hale gelecektir.",
  },
  {
    q: "Faturalandırma nasıl çalışır?",
    a: "Aylık seçenekte her ay, yıllık seçenekte her yıl otomatik yenilenir. Yıllık planda iki ay indirim kazanırsın. İstediğin zaman iptal edebilirsin.",
  },
  {
    q: "Planımı sonra değiştirebilir miyim?",
    a: "Evet. Pro ve Ultra arasında istediğin zaman geçiş yapabilirsin; değişiklik bir sonraki faturalandırma döneminde geçerli olur.",
  },
  {
    q: "Ödemelerimi kim işliyor?",
    a: "Tüm ödemeler, Merchant of Record olarak Paddle tarafından işlenir. Kart bilgileri Oroya sunucularında saklanmaz.",
  },
];

export function PricingContent() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10">
      <header className="flex flex-col items-center text-center">
        <span className="badge bg-accent/15 text-accent">
          <Icon name="star" size={12} className="mr-1" />
          Fiyatlandırma
        </span>
        <h1 className="mt-3 text-3xl font-display font-extrabold tracking-tight text-text-primary sm:text-4xl">
          Topluluğa ücretsiz katıl, büyüdükçe yüksel.
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-text-secondary">
          Oroya, konu-odaklı tartışmalar için ücretsizdir. Daha fazla kontrol,
          daha derin içerik ve öncelikli erişim istediğinde Pro veya Ultra
          planlarına geçebilirsin.
        </p>

        <div className="mt-6 inline-flex items-center gap-1 rounded-full border border-border bg-bg-secondary p-1">
          <BillingButton
            active={billing === "monthly"}
            onClick={() => setBilling("monthly")}
          >
            Aylık
          </BillingButton>
          <BillingButton
            active={billing === "yearly"}
            onClick={() => setBilling("yearly")}
          >
            Yıllık
            <span className="ml-1.5 rounded-badge bg-success/15 px-1.5 py-0.5 text-[10px] font-semibold text-success">
              2 ay bedava
            </span>
          </BillingButton>
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} billing={billing} />
        ))}
      </section>

      <p className="text-center text-xs text-text-secondary">
        Tüm fiyatlar USD cinsindendir ve Paddle üzerinden işlenir. KDV/yerel
        vergiler ödeme adımında görüntülenir.
      </p>

      <section className="card">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-text-primary">
          <Icon name="chat" size={20} className="text-accent" />
          Sıkça sorulan sorular
        </h2>
        <div className="mt-4 divide-y divide-border">
          {FAQ.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-text-primary">
                {item.q}
                <Icon
                  name="chevron-down"
                  size={16}
                  className="text-text-secondary transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center gap-4 rounded-card border border-border bg-gradient-to-br from-accent/15 via-bg-secondary to-bg-secondary p-8 text-center">
        <h2 className="text-xl font-display font-bold tracking-tight text-text-primary">
          Hâlâ soruların mı var?
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-text-secondary">
          Planlar, faturalandırma veya abonelik hakkında yardıma ihtiyacın
          olursa bize ulaş. Satın alma deneyimini netleştirmekten mutluluk duyarız.
        </p>
        <a
          href="mailto:support@fluxsphere.sbs"
          className="btn-secondary"
        >
          <Icon name="mail" size={16} />
          support@fluxsphere.sbs
        </a>
      </section>
    </div>
  );
}

function BillingButton({
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
        "inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-accent text-white"
          : "text-text-secondary hover:text-text-primary",
      )}
    >
      {children}
    </button>
  );
}

function PlanCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  const price = billing === "monthly" ? plan.monthly : plan.yearly;
  const isPaid = plan.monthly > 0;

  return (
    <div
      className={cn(
        "card relative flex flex-col",
        plan.highlight && "border-accent/60 shadow-lg shadow-accent/10",
      )}
    >
      {plan.badge && (
        <span
          className={cn(
            "absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-badge px-2.5 py-0.5 text-xs font-semibold",
            plan.highlight
              ? "bg-accent text-white"
              : "bg-bg-tertiary text-text-secondary",
          )}
        >
          {plan.badge}
        </span>
      )}

      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-lg font-bold tracking-tight text-text-primary">
          {plan.name}
        </h3>
        {plan.highlight && (
          <Icon name="fire" size={18} className="text-accent" />
        )}
      </div>
      <p className="mt-1 text-sm text-text-secondary">{plan.tagline}</p>

      <div className="mt-5 flex items-end gap-1">
        <span className="text-4xl font-display font-extrabold tracking-tight text-text-primary">
          ${price}
        </span>
        {isPaid && (
          <span className="mb-1 text-sm text-text-secondary">/ay</span>
        )}
      </div>
      <p className="mt-1 h-4 text-xs text-text-secondary">
        {isPaid
          ? billing === "yearly"
            ? `yıllık $${plan.yearly * 12} olarak faturalandırılır`
            : "her ay faturalandırılır"
          : "ücretsiz"}
      </p>

      <ul className="mt-5 flex flex-1 flex-col gap-2.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <Icon
              name="check"
              size={16}
              className="mt-0.5 shrink-0 text-success"
            />
            <span className="text-text-secondary">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        {isPaid ? (
          <button
            type="button"
            disabled
            title="Ödemeler yakında aktifleşecek"
            className={cn(
              "btn w-full cursor-not-allowed",
              plan.highlight
                ? "btn-primary opacity-90"
                : "btn-secondary opacity-70",
            )}
          >
            {plan.cta}
            <span className="ml-1.5 rounded-badge bg-bg-tertiary px-1.5 py-0.5 text-[10px] font-semibold text-text-secondary">
              Yakında
            </span>
          </button>
        ) : (
          <Link href="/register" className="btn-secondary w-full">
            {plan.cta}
          </Link>
        )}
      </div>
    </div>
  );
}
