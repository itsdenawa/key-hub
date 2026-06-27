import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type AdminPanelProps = {
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  description?: string;
  title?: string;
};

export function AdminPanel({
  action,
  children,
  className,
  description,
  title,
}: AdminPanelProps) {
  return (
    <section
      className={cn(
        "min-w-0 overflow-hidden rounded-lg border border-white/10 bg-[#071020]/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
        className,
      )}
    >
      {title || action ? (
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? (
              <h2 className="text-xl font-bold text-white">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm leading-6 text-slate-400">
                {description}
              </p>
            ) : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

type AdminStatusBadgeProps = {
  children?: ReactNode;
  status: string;
};

export function AdminStatusBadge({ children, status }: AdminStatusBadgeProps) {
  const normalized = status.toLowerCase();
  const tone = getStatusTone(normalized);

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-md border px-2.5 py-1 text-xs font-bold capitalize",
        tone,
      )}
    >
      {children ?? normalized.replaceAll("-", " ")}
    </span>
  );
}

export function AdminEmptyState({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
      <p className="text-base font-bold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{children}</p>
    </div>
  );
}

export function formatAdminDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusTone(status: string) {
  if (
    ["active", "admin", "completed", "fulfilled", "paid", "success"].includes(
      status,
    )
  ) {
    return "border-emerald-400/25 bg-emerald-500/12 text-emerald-300";
  }

  if (["draft", "pending", "processing"].includes(status)) {
    return "border-amber-400/25 bg-amber-500/12 text-amber-300";
  }

  if (["archived", "canceled", "cancelled", "refunded"].includes(status)) {
    return "border-red-400/25 bg-red-500/12 text-red-300";
  }

  return "border-blue-400/25 bg-blue-500/12 text-blue-300";
}
