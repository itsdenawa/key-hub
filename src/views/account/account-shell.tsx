import { demoOrders } from "@/entities/order/model";
import { demoProfile } from "@/entities/user/model";
import { getCurrentUserProfile } from "@/entities/user/session";
import { formatMoney } from "@/shared/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { AccountNav, type AccountSection } from "@/views/account/account-nav";

type AccountShellProps = {
  title: string;
  description: string;
  section: AccountSection;
};

export function AccountShell({
  title,
  description,
  section,
}: AccountShellProps) {
  return (
    <AccountShellContent
      title={title}
      description={description}
      section={section}
    />
  );
}

async function AccountShellContent({
  title,
  description,
  section,
}: AccountShellProps) {
  const { profile } = await getCurrentUserProfile();
  const displayName = profile?.full_name || demoProfile.fullName;
  const email = profile?.email || demoProfile.email;

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside>
        <AccountNav section={section} />
      </aside>
      <section className="space-y-5">
        <div>
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Demo account state</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">User</p>
              <p className="font-medium">{displayName}</p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Orders</p>
              <p className="font-medium">{demoOrders.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lifetime spend</p>
              <p className="font-medium">
                {formatMoney(
                  demoOrders.reduce(
                    (total, order) => total + order.totalCents,
                    0,
                  ),
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
