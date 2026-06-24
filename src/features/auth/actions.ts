"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { signInSchema, signUpSchema } from "@/features/auth/schemas";
import { createSupabaseServerClient } from "@/shared/api/supabase/server";
import { siteConfig } from "@/shared/config/site";

export async function signInAction(formData: FormData) {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next"),
  });

  if (!parsed.success) {
    redirectWithMessage("/auth/sign-in", "Enter a valid email and password.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    redirectWithMessage("/auth/sign-in", error.message);
  }

  revalidatePath("/", "layout");
  redirect(safeNextPath(parsed.data.next));
}

export async function signUpAction(formData: FormData) {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    fullName: formData.get("fullName"),
    password: formData.get("password"),
    next: formData.get("next"),
  });

  if (!parsed.success) {
    redirectWithMessage(
      "/auth/sign-up",
      "Enter your name, a valid email, and a password with at least 6 characters.",
    );
  }

  const supabase = await createSupabaseServerClient();
  const next = safeNextPath(parsed.data.next);
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
      },
      emailRedirectTo: `${siteConfig.url}/auth/callback?next=${encodeURIComponent(
        next,
      )}`,
    },
  });

  if (error) {
    redirectWithMessage("/auth/sign-up", error.message);
  }

  revalidatePath("/", "layout");

  if (data.session) {
    redirect(next);
  }

  redirectWithMessage(
    "/auth/sign-in",
    "Check your email to confirm your account, then sign in.",
  );
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/auth/sign-in");
}

function safeNextPath(value: FormDataEntryValue | string | undefined | null) {
  const next = typeof value === "string" ? value : undefined;

  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/account/orders";
  }

  return next;
}

function redirectWithMessage(path: string, message: string): never {
  const params = new URLSearchParams({ message });
  redirect(`${path}?${params.toString()}`);
}
