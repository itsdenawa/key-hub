"use client";

import { Save } from "lucide-react";
import { useActionState } from "react";

import { initialAccountActionState } from "@/features/account/action-state";
import { updateProfileAction } from "@/features/account/actions";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

type ProfileFormProps = {
  email: string;
  fullName: string;
  role: string;
  canSave: boolean;
};

export function ProfileForm({
  email,
  fullName,
  role,
  canSave,
}: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialAccountActionState,
  );

  return (
    <section className="rounded-lg border border-white/10 bg-[#071020]/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">Profile details</h2>
        <p className="mt-1 text-sm text-slate-400">
          Keep your customer identity and order records tidy.
        </p>
      </div>

      <form action={formAction} className="grid gap-5">
        <div className="grid gap-2">
          <label
            className="text-sm font-semibold text-slate-200"
            htmlFor="fullName"
          >
            Display name
          </label>
          <Input
            id="fullName"
            name="fullName"
            defaultValue={fullName}
            minLength={2}
            maxLength={80}
            required
            className="border-white/10 bg-white/[0.035] text-white placeholder:text-slate-500"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <InfoItem label="Email" value={email} />
          <InfoItem label="Role" value={role} />
        </div>

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
          {isPending ? "Saving..." : "Save profile"}
        </Button>
      </form>
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 font-semibold capitalize text-white">{value}</p>
    </div>
  );
}
