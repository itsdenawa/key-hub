"use client";

import { Boxes, ImageIcon, Save } from "lucide-react";
import { type ComponentProps, useActionState } from "react";

import { initialAdminActionState } from "@/features/admin/action-state";
import { upsertCategoryAction } from "@/features/admin/actions";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
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
    <section className="min-w-0 overflow-hidden rounded-lg border border-white/10 bg-[#071020]/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="mb-5 flex items-start gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-lg border border-violet-400/20 bg-violet-500/15 text-violet-300">
          <Boxes className="size-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">
            {category ? "Edit category" : "Create category"}
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            Control catalog navigation, storefront filters, and product
            grouping.
          </p>
        </div>
      </div>

      <form action={formAction} className="grid gap-5">
        <input type="hidden" name="id" value={category?.id ?? ""} />

        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
            <span className="grid size-7 place-items-center rounded-lg bg-violet-500/15 text-violet-300">
              <Boxes className="size-4" />
            </span>
            Category details
          </div>
          <div className="grid gap-4">
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
          </div>
        </div>

        <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-4 text-sm">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={category?.isActive ?? true}
            className="mt-0.5 size-4 rounded border-white/20 bg-[#0a1223] accent-violet-500"
          />
          <span>
            <span className="block font-bold text-white">
              Active in storefront
            </span>
            <span className="mt-1 block leading-6 text-slate-400">
              Show this category in catalog navigation and public filters.
            </span>
          </span>
        </label>

        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
            <ImageIcon className="size-4 text-violet-300" />
            Image guidance
          </div>
          <p className="text-sm leading-6 text-slate-400">
            Use a public product image path for now. Storage uploads stay behind
            the Supabase asset flow.
          </p>
        </div>

        {state.message ? (
          <p
            className={cn(
              "rounded-lg border px-3 py-2 text-sm",
              state.status === "success"
                ? "border-emerald-400/25 bg-emerald-500/12 text-emerald-300"
                : "border-red-400/25 bg-red-500/12 text-red-300",
            )}
          >
            {state.message}
          </p>
        ) : null}

        <Button
          className="h-11 bg-gradient-to-r from-violet-600 to-blue-500 text-sm font-bold text-white shadow-lg shadow-violet-950/30 hover:brightness-110"
          type="submit"
          disabled={!canSave || isPending}
        >
          <Save className="size-4" />
          {isPending
            ? "Saving..."
            : category
              ? "Update category"
              : "Create category"}
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
      <label className="text-sm font-semibold text-slate-300" htmlFor={name}>
        {label}
      </label>
      <Input
        id={name}
        name={name}
        className={cn(
          "h-10 border-white/10 bg-[#0a1223] text-white placeholder:text-slate-600 focus-visible:ring-violet-400/40",
          className,
        )}
        {...props}
      />
    </div>
  );
}
