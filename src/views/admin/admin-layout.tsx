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
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside>
        <AdminNav section={section} />
      </aside>
      <section className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold">{title}</h1>
            <p className="mt-2 text-muted-foreground">{description}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {context.signedInAs
                ? `Signed in as ${context.signedInAs}`
                : "Read-only demo data is shown until Supabase admin access is configured."}
            </p>
          </div>
          <Badge variant={context.canWrite ? "success" : "outline"}>
            {context.canWrite ? "Admin write access" : "Read only"}
          </Badge>
        </div>
        {children}
      </section>
    </main>
  );
}
