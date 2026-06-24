import { KeyRound } from "lucide-react";
import Link from "next/link";

import { getCurrentUserProfile } from "@/entities/user/session";
import { signOutAction } from "@/features/auth/actions";
import { CartSummary } from "@/features/cart/cart-summary";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import { siteConfig } from "@/shared/config/site";
import { cn } from "@/shared/lib/utils";
import { Button, buttonVariants } from "@/shared/ui/button";

export async function SiteHeader() {
  const { profile, user } = await getCurrentUserProfile();
  const isSignedIn = Boolean(user);
  const navigation = siteConfig.navigation.filter(
    (item) => item.href !== "/admin/dashboard" || profile?.role === "admin",
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <KeyRound className="size-4" />
          </span>
          <span>{siteConfig.name}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <CartSummary />
          {isSignedIn ? (
            <form action={signOutAction}>
              <Button type="submit" variant="outline" size="sm">
                Sign out
              </Button>
            </form>
          ) : (
            <Link
              href="/auth/sign-in"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Sign in
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
