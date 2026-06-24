"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { AccountActionState } from "@/features/account/action-state";
import {
  addressSchema,
  deleteAddressSchema,
  profileSchema,
} from "@/features/account/schemas";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { hasSupabaseBrowserEnv } from "@/shared/config/env";

export async function updateProfileAction(
  _state: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  if (!hasSupabaseBrowserEnv()) {
    return {
      status: "error",
      message: "Connect Supabase before saving account changes.",
    };
  }

  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Enter a display name between 2 and 80 characters.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in?next=/account/profile");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.fullName })
    .eq("id", user.id);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidatePath("/account/profile");
  revalidatePath("/", "layout");

  return {
    status: "success",
    message: "Profile updated.",
  };
}

export async function upsertAddressAction(
  _state: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  if (!hasSupabaseBrowserEnv()) {
    return {
      status: "error",
      message: "Connect Supabase before saving billing addresses.",
    };
  }

  const parsed = addressSchema.safeParse({
    id: emptyToUndefined(formData.get("id")),
    label: formData.get("label"),
    fullName: formData.get("fullName"),
    line1: formData.get("line1"),
    line2: emptyToUndefined(formData.get("line2")),
    city: formData.get("city"),
    region: emptyToUndefined(formData.get("region")),
    postalCode: formData.get("postalCode"),
    country: formData.get("country"),
    isDefault: formData.get("isDefault") === "on",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the address fields and try again.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in?next=/account/addresses");
  }

  if (parsed.data.isDefault) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);
  }

  const payload = {
    city: parsed.data.city,
    country: parsed.data.country.toUpperCase(),
    full_name: parsed.data.fullName,
    is_default: parsed.data.isDefault,
    label: parsed.data.label,
    line1: parsed.data.line1,
    line2: parsed.data.line2 ?? null,
    postal_code: parsed.data.postalCode,
    region: parsed.data.region ?? null,
    user_id: user.id,
  };

  const query = parsed.data.id
    ? supabase
        .from("addresses")
        .update(payload)
        .eq("id", parsed.data.id)
        .eq("user_id", user.id)
    : supabase.from("addresses").insert(payload);
  const { error } = await query;

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  revalidatePath("/account/addresses");

  return {
    status: "success",
    message: parsed.data.id ? "Address updated." : "Address saved.",
  };
}

export async function deleteAddressAction(formData: FormData) {
  if (!hasSupabaseBrowserEnv()) {
    return;
  }

  const parsed = deleteAddressSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in?next=/account/addresses");
  }

  await supabase
    .from("addresses")
    .delete()
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  revalidatePath("/account/addresses");
}

function emptyToUndefined(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
