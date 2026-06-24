import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
});

export const addressSchema = z.object({
  id: z.uuid().optional(),
  label: z.string().trim().min(2).max(40),
  fullName: z.string().trim().min(2).max(80),
  line1: z.string().trim().min(3).max(120),
  line2: z.string().trim().max(120).optional(),
  city: z.string().trim().min(2).max(80),
  region: z.string().trim().max(80).optional(),
  postalCode: z.string().trim().min(3).max(20),
  country: z.string().trim().min(2).max(2),
  isDefault: z.boolean().default(false),
});

export const deleteAddressSchema = z.object({
  id: z.uuid(),
});
