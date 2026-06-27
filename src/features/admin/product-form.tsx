"use client";

import { FileArchive, ImageIcon, Save, Sparkles } from "lucide-react";
import { type ComponentProps, useActionState } from "react";

import { initialAdminActionState } from "@/features/admin/action-state";
import { upsertProductAction } from "@/features/admin/actions";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";

type EditableCategory = {
  id: string;
  name: string;
};

type EditableProduct = {
  asset: {
    filename: string;
    sizeMb: number;
    storagePath: string;
  };
  categoryId: string | null;
  delivery: string;
  description: string;
  fileTypes: string[];
  id: string;
  imagePath: string;
  license: string;
  longDescription: string;
  priceCents: number;
  rating: number;
  slug: string;
  status: "draft" | "active" | "archived";
  stripePriceId: string;
  title: string;
};

type ProductFormProps = {
  categories: EditableCategory[];
  product?: EditableProduct;
  canSave: boolean;
};

export function ProductForm({
  categories,
  product,
  canSave,
}: ProductFormProps) {
  const [state, formAction, isPending] = useActionState(
    upsertProductAction,
    initialAdminActionState,
  );

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-white/10 bg-[#071020]/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="mb-5 flex items-start gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-lg border border-violet-400/20 bg-violet-500/15 text-violet-300">
          <Sparkles className="size-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">
            {product ? "Edit product" : "Create product"}
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            Keep storefront copy, checkout pricing, and protected file metadata
            together.
          </p>
        </div>
      </div>

      <form action={formAction} className="grid gap-5">
        <input type="hidden" name="id" value={product?.id ?? ""} />

        <FormBlock icon={<Sparkles className="size-4" />} title="Basics">
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Title"
              name="title"
              defaultValue={product?.title ?? ""}
              required
            />
            <Field
              label="Slug"
              name="slug"
              defaultValue={product?.slug ?? ""}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <SelectField
              defaultValue={product?.categoryId ?? ""}
              label="Category"
              name="categoryId"
            >
              <option value="">Uncategorized</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </SelectField>
            <SelectField
              defaultValue={product?.status ?? "draft"}
              label="Status"
              name="status"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </SelectField>
            <Field
              label="Price cents"
              name="priceCents"
              type="number"
              min={0}
              defaultValue={product?.priceCents ?? 4900}
              required
            />
          </div>
          <Field
            label="Short description"
            name="description"
            defaultValue={product?.description ?? ""}
            required
          />
          <TextArea
            label="Long description"
            name="longDescription"
            defaultValue={product?.longDescription ?? ""}
            required
          />
        </FormBlock>

        <FormBlock icon={<ImageIcon className="size-4" />} title="Storefront">
          <div className="grid gap-4 md:grid-cols-3">
            <Field
              label="Rating"
              name="rating"
              type="number"
              min={0}
              max={5}
              step={0.1}
              defaultValue={product?.rating ?? 4.8}
              required
            />
            <Field
              label="Delivery"
              name="delivery"
              defaultValue={product?.delivery ?? "Instant ZIP download"}
              required
            />
            <Field
              label="License"
              name="license"
              defaultValue={product?.license ?? "Solo commercial license"}
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="File types"
              name="fileTypes"
              defaultValue={product?.fileTypes.join(", ") ?? "MD, PDF, ZIP"}
              required
            />
            <Field
              label="Stripe price ID"
              name="stripePriceId"
              defaultValue={product?.stripePriceId ?? ""}
              placeholder="price_..."
            />
          </div>
          <Field
            label="Public image path"
            name="imagePath"
            defaultValue={product?.imagePath ?? ""}
            placeholder="launch-kit-pro.png"
          />
        </FormBlock>

        <FormBlock icon={<FileArchive className="size-4" />} title="Asset">
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Asset filename"
              name="assetFilename"
              defaultValue={product?.asset.filename ?? ""}
              placeholder="launch-kit-pro.zip"
            />
            <Field
              label="Asset storage path"
              name="assetStoragePath"
              defaultValue={product?.asset.storagePath ?? ""}
              placeholder="launch-kit-pro/latest.zip"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Asset size MB"
              name="assetSizeMb"
              type="number"
              min={0}
              step={0.1}
              defaultValue={product?.asset.sizeMb ?? 0}
            />
            <Field
              label="Asset version"
              name="assetVersion"
              defaultValue="latest"
            />
          </div>
        </FormBlock>

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
            : product
              ? "Update product"
              : "Create product"}
        </Button>
      </form>
    </section>
  );
}

function FormBlock({
  children,
  icon,
  title,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
        <span className="grid size-7 place-items-center rounded-lg bg-violet-500/15 text-violet-300">
          {icon}
        </span>
        {title}
      </div>
      <div className="grid gap-4">{children}</div>
    </div>
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

function SelectField({
  children,
  label,
  name,
  className,
  ...props
}: {
  children: React.ReactNode;
  label: string;
  name: string;
} & Omit<ComponentProps<typeof Select>, "name">) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-semibold text-slate-300" htmlFor={name}>
        {label}
      </label>
      <Select
        id={name}
        name={name}
        className={cn(
          "h-10 border-white/10 bg-[#0a1223] text-white focus-visible:ring-violet-400/40",
          className,
        )}
        {...props}
      >
        {children}
      </Select>
    </div>
  );
}

type TextAreaProps = {
  label: string;
  name: string;
} & ComponentProps<"textarea">;

function TextArea({ label, name, className, ...props }: TextAreaProps) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-semibold text-slate-300" htmlFor={name}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        className={cn(
          "min-h-28 w-full rounded-lg border border-white/10 bg-[#0a1223] px-3 py-2 text-sm text-white shadow-xs outline-none transition-colors placeholder:text-slate-600 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-violet-400/40 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
}
