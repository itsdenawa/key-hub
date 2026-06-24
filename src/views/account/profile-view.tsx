import { ProfileForm } from "@/features/account/profile-form";
import { formatMoney } from "@/shared/lib/format";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { getAccountOverview } from "@/views/account/account-data";
import { AccountNav } from "@/views/account/account-nav";

export async function ProfileView() {
  const { ordersCount, profile, totalSpendCents } = await getAccountOverview();

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside>
        <AccountNav section="profile" />
      </aside>
      <section className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold">Profile</h1>
            <p className="mt-2 text-muted-foreground">
              Manage the customer identity used for orders and downloads.
            </p>
          </div>
          {profile.isDemo ? <Badge variant="outline">Demo state</Badge> : null}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Orders" value={String(ordersCount)} />
          <MetricCard
            label="Lifetime spend"
            value={formatMoney(totalSpendCents)}
          />
          <MetricCard label="Account type" value={profile.role} />
        </div>

        <ProfileForm
          canSave={!profile.isDemo}
          email={profile.email}
          fullName={profile.fullName}
          role={profile.role}
        />
      </section>
    </main>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
};

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold capitalize">{value}</p>
      </CardContent>
    </Card>
  );
}
