import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-bg-secondary/40">
      <div className="container-app grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="max-w-xs text-xs leading-relaxed text-text-secondary">
            Geliştiriciler için konu-odaklı sosyal platform. Kalıcı, aranabilir, büyüyen tartışmalar.
          </p>
        </div>

        <nav className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Platform
          </h2>
          <ul className="flex flex-col gap-2 text-sm text-text-secondary">
            <li>
              <Link href="/explore" className="transition-colors hover:text-text-primary">
                Keşfet
              </Link>
            </li>
            <li>
              <Link href="/rooms" className="transition-colors hover:text-text-primary">
                Odalar
              </Link>
            </li>
            <li>
              <Link href="/new-topic" className="transition-colors hover:text-text-primary">
                Konu Aç
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="transition-colors hover:text-text-primary">
                Fiyatlandırma
              </Link>
            </li>
          </ul>
        </nav>

        <nav className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Yasal
          </h2>
          <ul className="flex flex-col gap-2 text-sm text-text-secondary">
            <li>
              <Link href="/terms" className="transition-colors hover:text-text-primary">
                Kullanım Şartları
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="transition-colors hover:text-text-primary">
                Gizlilik Politikası
              </Link>
            </li>
            <li>
              <Link href="/refund" className="transition-colors hover:text-text-primary">
                İade Politikası
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
            &copy; {year} Oroya. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
