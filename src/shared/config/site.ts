export const siteConfig = {
  name: "KeyHub",
  description:
    "A modern marketplace for premium keys, templates, presets, and digital toolkits.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  navigation: [
    { label: "Products", href: "/products" },
    { label: "Orders", href: "/account/orders" },
    { label: "Admin", href: "/admin/dashboard" },
  ],
} as const;
