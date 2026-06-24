import { Bell, CalendarDays, ChevronDown, Search } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/shared/ui/badge";
import { type AdminSection, getAdminContext } from "@/views/admin/admin-data";
import { AdminNav } from "@/views/admin/admin-nav";

type AdminLayoutProps = {
  children: ReactNode;
  description: string;
  section: AdminSection;
  title: string;
};

export async function AdminLayout({
  children,
  description,
  section,
  title,
}: AdminLayoutProps) {
  const context = await getAdminContext();

  return (
    <main className="bg-[#050814] text-white">
      <div className="mx-auto grid w-full max-w-[1600px] lg:grid-cols-[280px_1fr]">
        <AdminNav section={section} />

        <section className="min-w-0 border-l border-white/10">
          <AdminTopbar signedInAs={context.signedInAs} />

          <div className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <h1 className="text-[34px] font-black leading-tight sm:text-[38px]">
                  {title}
                </h1>
                <p className="mt-2 text-sm text-slate-400">{description}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {context.signedInAs
                    ? `Signed in as ${context.signedInAs}`
                    : "Read-only demo data is shown until Supabase admin access is configured."}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={context.canWrite ? "success" : "outline"}>
                  {context.canWrite ? "Admin write access" : "Read only"}
                </Badge>
                <button
                  type="button"
                  className="flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-4 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.07]"
                >
                  Jun 15 - Jun 21, 2026
                  <CalendarDays className="size-4" />
                </button>
              </div>
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}

function AdminTopbar({ signedInAs }: { signedInAs: string | null }) {
  return (
    <header className="flex min-h-[72px] flex-col gap-4 border-b border-white/10 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <label className="relative block w-full max-w-[660px]">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
        <input
          type="search"
          placeholder="Search orders, products, users..."
          className="h-11 w-full rounded-lg border border-white/10 bg-[#0a1223] pl-11 pr-4 text-sm text-white outline-none ring-violet-400/40 placeholder:text-slate-500 focus:ring-2"
        />
      </label>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative grid size-11 place-items-center rounded-lg border border-white/10 bg-white/[0.035] text-slate-200"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-violet-600 text-[10px] font-bold">
            5
          </span>
        </button>
        <button
          type="button"
          className="flex h-11 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] px-3 text-sm font-semibold text-white"
        >
          <span className="grid size-8 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_20%,rgba(56,189,248,0.7),transparent_35%),linear-gradient(135deg,#22143f,#7c2cff)] text-xs">
            A
          </span>
          <span className="hidden text-left sm:block">
            <span className="block">Administrator</span>
            <span className="block text-xs font-normal text-slate-500">
              {signedInAs ?? "admin@keyhub.dev"}
            </span>
          </span>
          <ChevronDown className="size-4 text-slate-500" />
        </button>
      </div>
    </header>
  );
}
