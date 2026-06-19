import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-bg-secondary/40">
        <div className="container-app flex h-14 items-center justify-between">
          <Logo />
          <Link href="/" className="btn-ghost text-sm">
            Ana sayfaya dön
          </Link>
        </div>
      </header>
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  );
}
