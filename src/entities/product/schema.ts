import { z } from "zod";

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(9),
});

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1),
});

export const catalogSearchSchema = z.object({
  fileType: z.string().optional(),
  license: z.string().optional(),
  price: z
    .enum(["all", "under-50", "50-75", "75-plus"])
    .optional()
    .default("all"),
  search: z.string().optional(),
  category: z.string().optional(),
  sort: z
    .enum(["featured", "newest", "price-asc", "price-desc"])
    .optional()
    .default("featured"),
  page: z.coerce.number().int().min(1).optional().default(1),
});
