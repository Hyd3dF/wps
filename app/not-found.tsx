import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-card bg-accent/15 text-accent">
        <Icon name="explore" size={32} />
      </div>
      <p className="text-5xl font-display font-extrabold tracking-tight text-text-primary">404</p>
      <h1 className="mt-3 text-xl font-display font-semibold text-text-primary">
        Bu konu açılmamış
      </h1>
      <p className="mt-2 max-w-sm text-sm text-text-secondary">
        Aradığın sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="btn-primary">
          <Icon name="home" size={16} />
          Ana sayfa
        </Link>
        <Link href="/explore" className="btn-secondary">
          <Icon name="explore" size={16} />
          Keşfet
        </Link>
      </div>
    </div>
  );
}
