"use client";

import { type ComponentProps, useActionState } from "react";

import { initialAccountActionState } from "@/features/account/action-state";
import { upsertAddressAction } from "@/features/account/actions";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle>
          {address ? "Edit address" : "Add billing address"}
        </CardTitle>
      </CardHeader>
      <CardContent>
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
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isDefault"
              defaultChecked={address?.isDefault ?? true}
              className="size-4 rounded border-border"
            />
            Set as default billing address
          </label>
          {state.message ? (
            <p
              className={`rounded-lg border px-3 py-2 text-sm ${
                state.status === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950 dark:text-emerald-300"
                  : "border-destructive/30 bg-destructive/10 text-destructive"
              }`}
            >
              {state.message}
            </p>
          ) : null}
          <Button type="submit" disabled={!canSave || isPending}>
            {isPending
              ? "Saving..."
              : address
                ? "Update address"
                : "Save address"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

type FieldProps = {
  label: string;
  name: string;
} & Omit<ComponentProps<typeof Input>, "name">;

function Field({ label, name, ...props }: FieldProps) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <Input id={name} name={name} {...props} />
    </div>
  );
}
