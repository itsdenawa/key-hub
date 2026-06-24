import { deleteAddressAction } from "@/features/account/actions";
import { AddressForm } from "@/features/account/address-form";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  type AddressSummary,
  getAccountAddresses,
  getAccountProfile,
} from "@/views/account/account-data";
import { AccountNav } from "@/views/account/account-nav";

export async function AddressesView() {
  const [addresses, profile] = await Promise.all([
    getAccountAddresses(),
    getAccountProfile(),
  ]);

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside>
        <AccountNav section="addresses" />
      </aside>
      <section className="space-y-5">
        <div>
          <h1 className="text-3xl font-semibold">Billing addresses</h1>
          <p className="mt-2 text-muted-foreground">
            Store billing details for checkout records and invoices.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
          <div className="space-y-4">
            {addresses.length > 0 ? (
              addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  canDelete={!profile.isDemo}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <h2 className="font-semibold">No billing addresses yet</h2>
                  <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                    Add a default billing address to keep customer records tidy
                    after Stripe checkout.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
          <AddressForm canSave={!profile.isDemo} />
        </div>
      </section>
    </main>
  );
}

type AddressCardProps = {
  address: AddressSummary;
  canDelete: boolean;
};

function AddressCard({ address, canDelete }: AddressCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>{address.label}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {address.fullName}
          </p>
        </div>
        {address.isDefault ? <Badge variant="success">Default</Badge> : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6">
          {address.line1}
          {address.line2 ? (
            <>
              <br />
              {address.line2}
            </>
          ) : null}
          <br />
          {[address.city, address.region, address.postalCode]
            .filter(Boolean)
            .join(", ")}
          <br />
          {address.country}
        </p>
        <div className="flex flex-wrap gap-2">
          <form action={deleteAddressAction}>
            <input type="hidden" name="id" value={address.id} />
            <Button type="submit" variant="destructive" disabled={!canDelete}>
              Delete
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
