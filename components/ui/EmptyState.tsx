import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon = "explore",
  title,
  description,
  action,
  className,
}: {
  icon?: IconName;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-card border border-dashed border-border bg-bg-secondary/50 px-5 py-10 text-center sm:py-12",
        className,
      )}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-btn border border-border bg-bg-tertiary text-text-secondary">
        <Icon name={icon} size={20} />
      </div>
      <h3 className="text-lg font-display font-semibold text-text-primary">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-text-secondary">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-display font-semibold tracking-tight text-text-primary sm:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
