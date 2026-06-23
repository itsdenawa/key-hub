import { AccountShell } from "@/views/account/account-shell";

export default function AccountWishlistPage() {
  return (
    <AccountShell
      section="wishlist"
      title="Wishlist"
      description="Saved products will be persisted to Supabase for authenticated users."
    />
  );
}
