import { ChevronRight, MapPin, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

import { deleteAddressAction } from "@/features/account/actions";
import { AddressForm } from "@/features/account/address-form";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
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
    <main className="bg-[#050814] text-white">
      <div className="mx-auto w-full max-w-[1440px] space-y-7 px-4 py-8 sm:px-6 lg:px-8 2xl:px-0">
        <Breadcrumb />

        <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside>
            <AccountNav section="addresses" />
          </aside>

          <section className="min-w-0 space-y-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-[34px] font-black leading-tight sm:text-[38px]">
                  Billing addresses
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                  Store billing details for checkout records and invoices.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-slate-300">
                <span className="font-bold text-white">{addresses.length}</span>{" "}
                saved addresses
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_460px]">
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
                  <EmptyAddresses />
                )}
              </div>
              <AddressForm canSave={!profile.isDemo} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Breadcrumb() {
  return (
    <nav className="flex items-center gap-2 text-sm text-slate-500">
      <Link href="/" className="hover:text-white">
        Home
      </Link>
      <ChevronRight className="size-4" />
      <span className="text-slate-300">Billing addresses</span>
    </nav>
  );
}

type AddressCardProps = {
  address: AddressSummary;
  canDelete: boolean;
};

function AddressCard({ address, canDelete }: AddressCardProps) {
  return (
    <article className="rounded-lg border border-white/10 bg-[#071020]/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-violet-500/15 text-violet-300">
            <MapPin className="size-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-white">{address.label}</h2>
              {address.isDefault ? (
                <Badge className="border-emerald-400/25 bg-emerald-500/12 text-emerald-200">
                  Default
                </Badge>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-slate-400">{address.fullName}</p>
          </div>
        </div>
        <form action={deleteAddressAction}>
          <input type="hidden" name="id" value={address.id} />
          <Button
            type="submit"
            variant="destructive"
            size="sm"
            disabled={!canDelete}
            className="border border-red-400/25 bg-red-500/10 text-red-200 hover:bg-red-500/20"
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
        </form>
      </header>

      <p className="mt-5 rounded-lg border border-white/10 bg-white/[0.025] p-4 text-sm leading-6 text-slate-300">
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
    </article>
  );
}

function EmptyAddresses() {
  return (
    <section className="rounded-lg border border-white/10 bg-[#071020]/85 p-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="mx-auto grid size-16 place-items-center rounded-2xl border border-violet-400/30 bg-violet-500/15 text-violet-200">
        <Plus className="size-8" />
      </div>
      <h2 className="mt-5 text-xl font-bold text-white">
        No billing addresses yet
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        Add a default billing address to keep customer records tidy after Stripe
        checkout.
      </p>
    </section>
  );
}
