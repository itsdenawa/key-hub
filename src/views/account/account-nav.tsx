import Link from "next/link";

export type AccountSection = "profile" | "orders" | "wishlist" | "addresses";

const accountNav = [
  { label: "Profile", href: "/account/profile", section: "profile" },
  { label: "Orders", href: "/account/orders", section: "orders" },
  { label: "Wishlist", href: "/account/wishlist", section: "wishlist" },
  { label: "Addresses", href: "/account/addresses", section: "addresses" },
] as const;

type AccountNavProps = {
  section: AccountSection;
};

export function AccountNav({ section }: AccountNavProps) {
  return (
    <nav className="grid gap-1" aria-label="Account">
      {accountNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`rounded-lg px-3 py-2 text-sm ${
            item.section === section
              ? "bg-accent font-medium text-accent-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
