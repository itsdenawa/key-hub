import type { CatalogSort, PriceRange, Product } from "@/shared/types/catalog";

export const products: Product[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
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
    compatibility: ["Next.js", "Supabase", "Stripe", "Markdown"],
    specs: [
      { label: "Files", value: "34 templates and examples" },
      { label: "Updates", value: "Minor updates included" },
      { label: "Use case", value: "Product launches and releases" },
    ],
    tags: ["launch", "checklists", "boilerplate"],
    status: "active",
    asset: {
      id: "asset-launch-kit-pro",
      productId: "00000000-0000-4000-8000-000000000001",
      filename: "launch-kit-pro.zip",
      sizeMb: 18,
      storagePath: "launch-kit-pro/latest.zip",
    },
    createdAt: "2026-06-01T09:00:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
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
    compatibility: ["Figma", "Tailwind CSS", "Design tokens"],
    specs: [
      { label: "Components", value: "48 production UI patterns" },
      { label: "Tokens", value: "Light and dark token sets" },
      { label: "Use case", value: "SaaS product interface systems" },
    ],
    tags: ["design", "tokens", "systems"],
    status: "active",
    asset: {
      id: "asset-design-vault",
      productId: "00000000-0000-4000-8000-000000000002",
      filename: "design-vault.zip",
      sizeMb: 42,
      storagePath: "design-vault/latest.zip",
    },
    createdAt: "2026-06-07T11:30:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
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
    compatibility: ["Notion", "Zapier", "CSV", "JSON"],
    specs: [
      { label: "Recipes", value: "22 workflow recipes" },
      { label: "Templates", value: "Support and content ops packs" },
      { label: "Use case", value: "Repeatable operational workflows" },
    ],
    tags: ["automation", "ops", "templates"],
    status: "active",
    asset: {
      id: "asset-automation-key",
      productId: "00000000-0000-4000-8000-000000000003",
      filename: "automation-key.zip",
      sizeMb: 11,
      storagePath: "automation-key/latest.zip",
    },
    createdAt: "2026-06-13T14:10:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
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
    compatibility: ["TypeScript", "OpenAPI", "Webhook systems"],
    specs: [
      { label: "Examples", value: "12 typed API flows" },
      { label: "Docs", value: "Integration and auth notes" },
      { label: "Use case", value: "SaaS API and webhook starts" },
    ],
    tags: ["api", "typescript", "webhooks"],
    status: "active",
    asset: {
      id: "asset-api-starter-pack",
      productId: "00000000-0000-4000-8000-000000000004",
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
  fileType?: string;
  license?: string;
  price?: PriceRange;
  page?: number;
};

export function getCatalogProducts({
  search,
  category,
  sort = "featured",
  fileType,
  license,
  price = "all",
  page = 1,
}: CatalogQuery) {
  return filterCatalogProducts(products, {
    search,
    category,
    sort,
    fileType,
    license,
    price,
    page,
  });
}

export function filterCatalogProducts(
  sourceProducts: Product[],
  {
    search,
    category,
    sort = "featured",
    fileType,
    license,
    price = "all",
    page = 1,
  }: CatalogQuery,
) {
  const pageSize = 6;
  const normalizedSearch = search?.trim().toLowerCase();

  const filtered = sourceProducts.filter((product) => {
    const matchesSearch = normalizedSearch
      ? `${product.title} ${product.description} ${product.categoryName}`
          .toLowerCase()
          .includes(normalizedSearch)
      : true;
    const matchesCategory = category ? product.categorySlug === category : true;
    const matchesFileType = fileType
      ? product.fileTypes.includes(fileType)
      : true;
    const matchesLicense = license ? product.license === license : true;
    const matchesPrice = matchesPriceRange(product.priceCents, price);

    return (
      product.status === "active" &&
      matchesSearch &&
      matchesCategory &&
      matchesFileType &&
      matchesLicense &&
      matchesPrice
    );
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

export function getCatalogFilters(sourceProducts = products) {
  return {
    fileTypes: uniqueSorted(
      sourceProducts.flatMap((product) => product.fileTypes),
    ),
    licenses: uniqueSorted(sourceProducts.map((product) => product.license)),
  };
}

function matchesPriceRange(priceCents: number, range: PriceRange) {
  if (range === "under-50") {
    return priceCents < 5000;
  }

  if (range === "50-75") {
    return priceCents >= 5000 && priceCents <= 7500;
  }

  if (range === "75-plus") {
    return priceCents > 7500;
  }

  return true;
}

function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}
