"use client";

import { type ComponentProps, useActionState } from "react";

import { initialAdminActionState } from "@/features/admin/action-state";
import { upsertCategoryAction } from "@/features/admin/actions";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";

type EditableCategory = {
  description: string;
  id: string;
  imagePath: string;
  isActive: boolean;
  name: string;
  slug: string;
  sortOrder: number;
};

type CategoryFormProps = {
  category?: EditableCategory;
  canSave: boolean;
};

export function CategoryForm({ category, canSave }: CategoryFormProps) {
  const [state, formAction, isPending] = useActionState(
    upsertCategoryAction,
    initialAdminActionState,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{category ? "Edit category" : "Create category"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <input type="hidden" name="id" value={category?.id ?? ""} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Name"
              name="name"
              defaultValue={category?.name ?? ""}
              required
            />
            <Field
              label="Slug"
              name="slug"
              defaultValue={category?.slug ?? ""}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              required
            />
          </div>
          <Field
            label="Description"
            name="description"
            defaultValue={category?.description ?? ""}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Image path"
              name="imagePath"
              defaultValue={category?.imagePath ?? ""}
              placeholder="design-vault.png"
            />
            <Field
              label="Sort order"
              name="sortOrder"
              type="number"
              min={0}
              defaultValue={category?.sortOrder ?? 0}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={category?.isActive ?? true}
              className="size-4 rounded border-border"
            />
            Active in storefront
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
              : category
                ? "Update category"
                : "Create category"}
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
