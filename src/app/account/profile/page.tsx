import { AccountShell } from "@/views/account/account-shell";

export default function AccountProfilePage() {
  return (
    <AccountShell
      section="profile"
      title="Profile"
      description="Manage customer profile fields before Supabase auth is wired in."
    />
  );
}
