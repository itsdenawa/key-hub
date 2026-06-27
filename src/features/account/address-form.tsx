"use client";

import { MapPin, Save } from "lucide-react";
import { type ComponentProps, useActionState } from "react";

import { initialAccountActionState } from "@/features/account/action-state";
import { upsertAddressAction } from "@/features/account/actions";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

type EditableAddress = {
  city: string;
  country: string;
  fullName: string;
  id: string;
  isDefault: boolean;
  label: string;
  line1: string;
  line2: string;
  postalCode: string;
  region: string;
};

type AddressFormProps = {
  address?: EditableAddress;
  canSave: boolean;
};

export function AddressForm({ address, canSave }: AddressFormProps) {
  const [state, formAction, isPending] = useActionState(
    upsertAddressAction,
    initialAccountActionState,
  );

  return (
    <section className="rounded-lg border border-white/10 bg-[#071020]/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="mb-5 flex items-start gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-violet-500/15 text-violet-300">
          <MapPin className="size-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">
            {address ? "Edit address" : "Add billing address"}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Used for checkout records, invoices, and customer support.
          </p>
        </div>
      </div>

      <form action={formAction} className="grid gap-4">
        <input type="hidden" name="id" value={address?.id ?? ""} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Label"
            name="label"
            defaultValue={address?.label ?? "Billing"}
            required
          />
          <Field
            label="Full name"
            name="fullName"
            defaultValue={address?.fullName ?? ""}
            autoComplete="name"
            required
          />
        </div>
        <Field
          label="Address line 1"
          name="line1"
          defaultValue={address?.line1 ?? ""}
          autoComplete="address-line1"
          required
        />
        <Field
          label="Address line 2"
          name="line2"
          defaultValue={address?.line2 ?? ""}
          autoComplete="address-line2"
        />
        <div className="grid gap-4 md:grid-cols-3">
          <Field
            label="City"
            name="city"
            defaultValue={address?.city ?? ""}
            autoComplete="address-level2"
            required
          />
          <Field
            label="Region"
            name="region"
            defaultValue={address?.region ?? ""}
            autoComplete="address-level1"
          />
          <Field
            label="Postal code"
            name="postalCode"
            defaultValue={address?.postalCode ?? ""}
            autoComplete="postal-code"
            required
          />
        </div>
        <Field
          label="Country"
          name="country"
          defaultValue={address?.country ?? "US"}
          autoComplete="country"
          maxLength={2}
          required
        />
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <input
            type="checkbox"
            name="isDefault"
            defaultChecked={address?.isDefault ?? true}
            className="size-4 rounded border-white/15 bg-transparent accent-violet-500"
          />
          Set as default billing address
        </label>
        {state.message ? (
          <p
            className={`rounded-lg border px-3 py-2 text-sm ${
              state.status === "success"
                ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-100"
                : "border-red-400/25 bg-red-500/10 text-red-100"
            }`}
          >
            {state.message}
          </p>
        ) : null}
        <Button
          type="submit"
          disabled={!canSave || isPending}
          className="h-11 w-fit bg-gradient-to-r from-violet-600 to-blue-500 px-5 text-white hover:from-violet-500 hover:to-blue-400"
        >
          <Save className="size-4" />
          {isPending
            ? "Saving..."
            : address
              ? "Update address"
              : "Save address"}
        </Button>
      </form>
    </section>
  );
}

type FieldProps = {
  label: string;
  name: string;
} & Omit<ComponentProps<typeof Input>, "name">;

function Field({ label, name, className, ...props }: FieldProps) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-semibold text-slate-200" htmlFor={name}>
        {label}
      </label>
      <Input
        id={name}
        name={name}
        className={`border-white/10 bg-white/[0.035] text-white placeholder:text-slate-500 ${className ?? ""}`}
        {...props}
      />
    </div>
  );
}
