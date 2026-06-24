import { Grid3X3, KeyRound, Search } from "lucide-react";
import Link from "next/link";

import { getCurrentUserProfile } from "@/entities/user/session";
import { signOutAction } from "@/features/auth/actions";
import { CartSummary } from "@/features/cart/cart-summary";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import { cn } from "@/shared/lib/utils";
import { Button, buttonVariants } from "@/shared/ui/button";

export async function SiteHeader() {
  const { user } = await getCurrentUserProfile();
  const isSignedIn = Boolean(user);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050814]/85 backdrop-blur-xl">
      <div className="mx-auto grid min-h-[86px] w-full max-w-[1290px] grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 lg:grid-cols-[210px_130px_1fr_auto] lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-9 items-center justify-center rounded-md border border-cyan-300/40 bg-violet-500/18 text-cyan-300 shadow-[0_0_28px_rgba(124,58,237,0.5)]">
            <KeyRound className="size-5" />
          </span>
          <span className="text-[21px] font-black uppercase tracking-normal text-white">
            Key<span className="text-violet-400">Hub</span>
          </span>
        </Link>
        <Link
          href="/products"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "hidden h-11 rounded-lg border-white/10 bg-white/[0.045] px-4 text-white hover:bg-white/10 lg:inline-flex",
          )}
        >
          <Grid3X3 className="size-4" />
          Catalog
        </Link>
        <Link
          href="/products"
          className="hidden h-11 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:border-violet-400/50 hover:text-white md:flex"
        >
          <Search className="size-4" />
          <span className="flex-1">Search digital products...</span>
          <kbd className="rounded-md bg-white/5 px-1.5 py-0.5 text-[11px] text-muted-foreground">
            ⌘K
          </kbd>
        </Link>
        <div className="flex items-center justify-end gap-2">
          <Link
            href="/products"
            aria-label="Open catalog"
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "border-white/10 bg-white/[0.045] text-white hover:bg-white/10 lg:hidden",
            )}
          >
            <Grid3X3 className="size-4" />
          </Link>
          <CartSummary />
          {isSignedIn ? (
            <form action={signOutAction}>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                Sign out
              </Button>
            </form>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "hidden h-11 rounded-lg border-white/10 bg-white/[0.045] px-5 text-white hover:bg-white/10 sm:inline-flex",
                )}
              >
                Sign in
              </Link>
              <Link
                href="/auth/sign-up"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "h-11 rounded-lg bg-gradient-to-r from-violet-500 to-blue-500 px-5 font-bold text-white shadow-[0_0_24px_rgba(124,58,237,0.42)] hover:from-violet-400 hover:to-blue-400",
                )}
              >
                Register
              </Link>
            </>
          )}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
