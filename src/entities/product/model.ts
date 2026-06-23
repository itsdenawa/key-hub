import type { CatalogSort, Product } from "@/shared/types/catalog";

export const products: Product[] = [
  {
    id: "prod-keyhub-launch-kit",
    title: "Launch Kit Pro",
    slug: "launch-kit-pro",
    categorySlug: "developer",
    categoryName: "Developer",
    description:
      "A polished launch checklist, boilerplate, and release notes pack.",
    longDescription:
      "Launch Kit Pro gives independent builders a compact operating system for shipping digital products: release templates, preflight checklists, customer email copy, and a lightweight analytics planning sheet.",
    imageUrl: "/products/launch-kit-pro.png",
    gallery: ["/products/launch-kit-pro.png", "/products/dev-pack.png"],
    priceCents: 4900,
    rating: 4.9,
    delivery: "Instant ZIP download",
    fileTypes: ["MD", "TS", "PDF"],
    license: "Solo commercial license",
    status: "active",
    asset: {
      id: "asset-launch-kit-pro",
      productId: "prod-keyhub-launch-kit",
      filename: "launch-kit-pro.zip",
      sizeMb: 18,
      storagePath: "launch-kit-pro/latest.zip",
    },
    createdAt: "2026-06-01T09:00:00.000Z",
  },
  {
    id: "prod-design-vault",
    title: "Design Vault",
    slug: "design-vault",
    categorySlug: "design",
    categoryName: "Design",
    description:
      "Design tokens, landing patterns, and component specs for SaaS teams.",
    longDescription:
      "Design Vault contains a focused collection of product-ready tokens, UI patterns, and specification docs for teams that need a calm, premium interface foundation without starting from a blank canvas.",
    imageUrl: "/products/design-vault.png",
    gallery: ["/products/design-vault.png", "/products/automation-key.png"],
    priceCents: 7900,
    rating: 4.8,
    delivery: "Instant Figma and ZIP download",
    fileTypes: ["FIG", "JSON", "MD"],
    license: "Team commercial license",
    status: "active",
    asset: {
      id: "asset-design-vault",
      productId: "prod-design-vault",
      filename: "design-vault.zip",
      sizeMb: 42,
      storagePath: "design-vault/latest.zip",
    },
    createdAt: "2026-06-07T11:30:00.000Z",
  },
  {
    id: "prod-automation-key",
    title: "Automation Key",
    slug: "automation-key",
    categorySlug: "productivity",
    categoryName: "Productivity",
    description:
      "Reusable automations for support, content ops, and billing reviews.",
    longDescription:
      "Automation Key bundles practical workflow recipes, prompt patterns, and importable checklists for keeping operational work moving without inventing every process from scratch.",
    imageUrl: "/products/automation-key.png",
    gallery: ["/products/automation-key.png", "/products/launch-kit-pro.png"],
    priceCents: 3900,
    rating: 4.7,
    delivery: "Instant ZIP download",
    fileTypes: ["MD", "CSV", "JSON"],
    license: "Solo commercial license",
    status: "active",
    asset: {
      id: "asset-automation-key",
      productId: "prod-automation-key",
      filename: "automation-key.zip",
      sizeMb: 11,
      storagePath: "automation-key/latest.zip",
    },
    createdAt: "2026-06-13T14:10:00.000Z",
  },
  {
    id: "prod-dev-pack",
    title: "API Starter Pack",
    slug: "api-starter-pack",
    categorySlug: "developer",
    categoryName: "Developer",
    description:
      "Typed API client patterns, auth guards, and webhook examples.",
    longDescription:
      "API Starter Pack is a compact set of TypeScript examples and docs for teams building authenticated SaaS APIs, webhook consumers, and dashboard integrations.",
    imageUrl: "/products/dev-pack.png",
    gallery: ["/products/dev-pack.png", "/products/design-vault.png"],
    priceCents: 5900,
    rating: 4.8,
    delivery: "Instant repository download",
    fileTypes: ["TS", "MD", "YAML"],
    license: "Team commercial license",
    status: "active",
    asset: {
      id: "asset-api-starter-pack",
      productId: "prod-dev-pack",
      filename: "api-starter-pack.zip",
      sizeMb: 24,
      storagePath: "api-starter-pack/latest.zip",
    },
    createdAt: "2026-06-18T16:45:00.000Z",
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function getRelatedProducts(product: Product) {
  return products
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        candidate.categorySlug === product.categorySlug,
    )
    .slice(0, 3);
}

export type CatalogQuery = {
  search?: string;
  category?: string;
  sort?: CatalogSort;
  page?: number;
};

export function getCatalogProducts({
  search,
  category,
  sort = "featured",
  page = 1,
}: CatalogQuery) {
  const pageSize = 6;
  const normalizedSearch = search?.trim().toLowerCase();

  const filtered = products.filter((product) => {
    const matchesSearch = normalizedSearch
      ? `${product.title} ${product.description} ${product.categoryName}`
          .toLowerCase()
          .includes(normalizedSearch)
      : true;
    const matchesCategory = category ? product.categorySlug === category : true;

    return product.status === "active" && matchesSearch && matchesCategory;
  });

  const sorted = [...filtered].sort((left, right) => {
    if (sort === "newest") {
      return (
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      );
    }

    if (sort === "price-asc") {
      return left.priceCents - right.priceCents;
    }

    if (sort === "price-desc") {
      return right.priceCents - left.priceCents;
    }

    return right.rating - left.rating;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    products: sorted.slice(start, start + pageSize),
    total: sorted.length,
    totalPages,
    page: safePage,
  };
}
