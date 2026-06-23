import { AccountShell } from "@/views/account/account-shell";

export default function AccountAddressesPage() {
  return (
    <AccountShell
      section="addresses"
      title="Billing addresses"
      description="Store billing address details for checkout records and invoices."
    />
  );
}
