import Link from "next/link";
import { cn, initials, colorFromString } from "@/lib/utils";
import type { User } from "@/types";

interface AvatarProps {
  user: Pick<User, "username" | "displayName"> & { avatarUrl?: string | null };
  size?: number;
  href?: string | null;
  className?: string;
}

export function Avatar({ user, size = 40, href, className }: AvatarProps) {
  const color = colorFromString(user.username);
  const px = `${size}px`;

  const inner = user.avatarUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={user.avatarUrl}
      alt={user.displayName}
      width={size}
      height={size}
      className="rounded-full object-cover"
      style={{ width: px, height: px }}
    />
  ) : (
    <div
      className="flex items-center justify-center rounded-full font-semibold text-white"
      style={{
        width: px,
        height: px,
        backgroundColor: color,
        fontSize: size * 0.38,
      }}
      aria-hidden="true"
    >
      {initials(user.displayName || user.username)}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn("inline-block shrink-0", className)}
        style={{ width: px, height: px }}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className={cn("shrink-0", className)} style={{ width: px, height: px }}>
      {inner}
    </div>
  );
}
