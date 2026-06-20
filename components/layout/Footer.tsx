import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { getTranslator } from "@/lib/i18n";

export async function Footer() {
  const { t } = await getTranslator();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-bg-secondary/40">
      <div className="container-app grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="max-w-xs text-xs leading-relaxed text-text-secondary">
            {t("footer.tagline")}
          </p>
        </div>

        <nav className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {t("footer.platform")}
          </h2>
          <ul className="flex flex-col gap-2 text-sm text-text-secondary">
            <li>
              <Link href="/explore" className="transition-colors hover:text-text-primary">
                {t("nav.explore")}
              </Link>
            </li>
            <li>
              <Link href="/rooms" className="transition-colors hover:text-text-primary">
                {t("nav.rooms")}
              </Link>
            </li>
            <li>
              <Link href="/new-topic" className="transition-colors hover:text-text-primary">
                {t("nav.newTopic")}
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="transition-colors hover:text-text-primary">
                {t("pricing.badge")}
              </Link>
            </li>
          </ul>
        </nav>

        <nav className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {t("footer.legal")}
          </h2>
          <ul className="flex flex-col gap-2 text-sm text-text-secondary">
            <li>
              <Link href="/terms" className="transition-colors hover:text-text-primary">
                {t("legal.terms.title")}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="transition-colors hover:text-text-primary">
                {t("legal.privacy.title")}
              </Link>
            </li>
            <li>
              <Link href="/refund" className="transition-colors hover:text-text-primary">
                {t("legal.refund.title")}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Icon name="github" size={16} />
            <span>v0.1</span>
          </div>
          <a
            href="mailto:support@fluxsphere.sbs"
            className="inline-flex items-center gap-1.5 text-xs text-text-secondary transition-colors hover:text-text-primary"
          >
            <Icon name="mail" size={14} />
            support@fluxsphere.sbs
          </a>
          <p className="text-xs text-text-secondary/70">
            &copy; {year} {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
