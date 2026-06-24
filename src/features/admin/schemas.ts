import { z } from "zod";

const nullableUuidSchema = z
  .union([z.uuid(), z.literal(""), z.null(), z.undefined()])
  .transform((value) => (value ? value : null));

export const adminProductSchema = z.object({
  id: z.uuid().optional(),
  categoryId: nullableUuidSchema,
  title: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().min(10).max(240),
  longDescription: z.string().trim().min(10).max(2000),
  priceCents: z.coerce.number().int().min(0).max(999_999),
  status: z.enum(["draft", "active", "archived"]),
  rating: z.coerce.number().min(0).max(5).default(0),
  delivery: z.string().trim().min(2).max(80),
  fileTypes: z
    .string()
    .trim()
    .transform((value) =>
      value
        .split(",")
        .map((item) => item.trim().toUpperCase())
        .filter(Boolean),
    ),
  license: z.string().trim().min(2).max(120),
  stripePriceId: z.string().trim().optional(),
  imagePath: z.string().trim().optional(),
  assetFilename: z.string().trim().optional(),
  assetStoragePath: z.string().trim().optional(),
  assetSizeMb: z.coerce.number().min(0).max(10_000).default(0),
  assetVersion: z.string().trim().min(1).max(40).default("latest"),
});

export const deleteProductSchema = z.object({
  id: z.uuid(),
});

export const adminCategorySchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(2).max(80),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(240).optional(),
  imagePath: z.string().trim().optional(),
  isActive: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export const deleteCategorySchema = z.object({
  id: z.uuid(),
});

export const updateOrderStatusSchema = z.object({
  id: z.uuid(),
  status: z.enum(["pending", "paid", "fulfilled", "canceled", "refunded"]),
});
