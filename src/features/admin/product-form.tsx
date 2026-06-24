"use client";

import { type ComponentProps, useActionState } from "react";

import { initialAdminActionState } from "@/features/admin/action-state";
import { upsertProductAction } from "@/features/admin/actions";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle>{product ? "Edit product" : "Create product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <input type="hidden" name="id" value={product?.id ?? ""} />
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
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="categoryId">
                Category
              </label>
              <Select
                id="categoryId"
                name="categoryId"
                defaultValue={product?.categoryId ?? ""}
              >
                <option value="">Uncategorized</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="status">
                Status
              </label>
              <Select
                id="status"
                name="status"
                defaultValue={product?.status ?? "draft"}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </Select>
            </div>
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
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Public image path"
              name="imagePath"
              defaultValue={product?.imagePath ?? ""}
              placeholder="launch-kit-pro.png"
            />
            <Field
              label="Asset filename"
              name="assetFilename"
              defaultValue={product?.asset.filename ?? ""}
              placeholder="launch-kit-pro.zip"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Field
              label="Asset storage path"
              name="assetStoragePath"
              defaultValue={product?.asset.storagePath ?? ""}
              placeholder="launch-kit-pro/latest.zip"
            />
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
              : product
                ? "Update product"
                : "Create product"}
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

type TextAreaProps = {
  label: string;
  name: string;
} & ComponentProps<"textarea">;

function TextArea({ label, name, className, ...props }: TextAreaProps) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        className={`min-h-28 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ""}`}
        {...props}
      />
    </div>
  );
}
