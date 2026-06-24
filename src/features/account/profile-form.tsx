"use client";

import { useActionState } from "react";

import { initialAccountActionState } from "@/features/account/action-state";
import { updateProfileAction } from "@/features/account/actions";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle>Profile details</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-5">
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="fullName">
              Display name
            </label>
            <Input
              id="fullName"
              name="fullName"
              defaultValue={fullName}
              minLength={2}
              maxLength={80}
              required
            />
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium capitalize">{role}</p>
            </div>
          </div>
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
            {isPending ? "Saving..." : "Save profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
