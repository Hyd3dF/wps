import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2", className)}
      aria-label="Oroya — ana sayfa"
    >
      <span className="relative flex h-8 w-8 items-center justify-center rounded-btn bg-accent text-white font-display font-extrabold text-lg shadow-lg shadow-accent/30">
        O
      </span>
      {showText && (
        <span className="font-display text-xl font-extrabold tracking-tight text-text-primary">
          Oroya
        </span>
      )}
    </Link>
  );
}
