import type { CatalogSort, PriceRange, Product } from "@/shared/types/catalog";

export const products: Product[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    title: "Elden Ring",
    slug: "elden-ring",
    categorySlug: "keys",
    categoryName: "Steam • Key",
    description: "A global Steam activation key for Elden Ring.",
    longDescription:
      "Elden Ring delivers a dark fantasy open-world RPG experience with instant digital key delivery after checkout.",
    imageUrl: "/products/elden-ring-tile.png",
    gallery: [
      "/products/elden-ring-tile.png",
      "/products/xbox-game-pass-tile.png",
    ],
    priceCents: 2499,
    rating: 4.9,
    delivery: "Instant key delivery",
    fileTypes: ["KEY"],
    license: "Steam activation key",
    compatibility: ["Steam", "Windows"],
    specs: [
      { label: "Platform", value: "Steam" },
      { label: "Delivery", value: "Instant key" },
      { label: "Region", value: "Global" },
    ],
    tags: ["games", "steam", "key"],
    status: "active",
    asset: {
      id: "asset-elden-ring",
      productId: "00000000-0000-4000-8000-000000000001",
      filename: "elden-ring-key.txt",
      sizeMb: 0.1,
      storagePath: "elden-ring/key.txt",
    },
    createdAt: "2026-06-01T09:00:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    title: "Adobe Photoshop 2024",
    slug: "adobe-photoshop-2024",
    categorySlug: "software",
    categoryName: "License • 1 year",
    description: "A one-year Photoshop license for creative work.",
    longDescription:
      "Adobe Photoshop 2024 gives creators a full year of professional image editing tools with fast digital license delivery.",
    imageUrl: "/products/adobe-photoshop-2024-tile.png",
    gallery: [
      "/products/adobe-photoshop-2024-tile.png",
      "/products/figma-professional-tile.png",
    ],
    priceCents: 1490,
    rating: 4.8,
    delivery: "Instant license delivery",
    fileTypes: ["LICENSE"],
    license: "1 year license",
    compatibility: ["Windows", "macOS", "Adobe"],
    specs: [
      { label: "Duration", value: "1 year" },
      { label: "Delivery", value: "Digital license" },
      { label: "Use case", value: "Photo editing" },
    ],
    tags: ["software", "adobe", "design"],
    status: "active",
    asset: {
      id: "asset-adobe-photoshop-2024",
      productId: "00000000-0000-4000-8000-000000000002",
      filename: "photoshop-license.txt",
      sizeMb: 0.1,
      storagePath: "photoshop/license.txt",
    },
    createdAt: "2026-06-07T11:30:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    title: "ChatGPT Plus",
    slug: "chatgpt-plus",
    categorySlug: "subscriptions",
    categoryName: "Subscription • 1 month",
    description: "One month of ChatGPT Plus access.",
    longDescription:
      "ChatGPT Plus is a one-month digital subscription for faster AI-assisted work, writing, coding, and research.",
    imageUrl: "/products/chatgpt-plus-tile.png",
    gallery: [
      "/products/chatgpt-plus-tile.png",
      "/products/windows-11-pro-tile.png",
    ],
    priceCents: 699,
    rating: 4.9,
    delivery: "Instant subscription delivery",
    fileTypes: ["SUBSCRIPTION"],
    license: "1 month subscription",
    compatibility: ["Web", "Mobile", "AI tools"],
    specs: [
      { label: "Duration", value: "1 month" },
      { label: "Delivery", value: "Account access" },
      { label: "Use case", value: "AI productivity" },
    ],
    tags: ["ai", "subscription", "productivity"],
    status: "active",
    asset: {
      id: "asset-chatgpt-plus",
      productId: "00000000-0000-4000-8000-000000000003",
      filename: "chatgpt-plus-access.txt",
      sizeMb: 0.1,
      storagePath: "chatgpt-plus/access.txt",
    },
    createdAt: "2026-06-13T14:10:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    title: "Windows 11 Pro",
    slug: "windows-11-pro",
    categorySlug: "keys",
    categoryName: "Key • License",
    description: "A Windows 11 Pro activation key.",
    longDescription:
      "Windows 11 Pro includes a digital activation key for productivity, security, and everyday desktop work.",
    imageUrl: "/products/windows-11-pro-tile.png",
    gallery: [
      "/products/windows-11-pro-tile.png",
      "/products/adobe-photoshop-2024-tile.png",
    ],
    priceCents: 1190,
    rating: 4.8,
    delivery: "Instant key delivery",
    fileTypes: ["KEY"],
    license: "Windows Pro license",
    compatibility: ["Windows 11", "PC"],
    specs: [
      { label: "Edition", value: "Pro" },
      { label: "Delivery", value: "Activation key" },
      { label: "Use case", value: "Operating system" },
    ],
    tags: ["windows", "license", "key"],
    status: "active",
    asset: {
      id: "asset-windows-11-pro",
      productId: "00000000-0000-4000-8000-000000000004",
      filename: "windows-11-pro-key.txt",
      sizeMb: 0.1,
      storagePath: "windows-11-pro/key.txt",
    },
    createdAt: "2026-06-18T16:45:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000005",
    title: "Xbox Game Pass Ultimate",
    slug: "xbox-game-pass-ultimate",
    categorySlug: "subscriptions",
    categoryName: "Subscription • 1 month",
    description: "One month of Xbox Game Pass Ultimate.",
    longDescription:
      "Xbox Game Pass Ultimate gives access to a rotating game library with fast digital code delivery.",
    imageUrl: "/products/xbox-game-pass-tile.png",
    gallery: [
      "/products/xbox-game-pass-tile.png",
      "/products/elden-ring-tile.png",
    ],
    priceCents: 599,
    rating: 4.7,
    delivery: "Instant code delivery",
    fileTypes: ["CODE"],
    license: "1 month subscription",
    compatibility: ["Xbox", "PC", "Cloud gaming"],
    specs: [
      { label: "Duration", value: "1 month" },
      { label: "Delivery", value: "Digital code" },
      { label: "Use case", value: "Gaming subscription" },
    ],
    tags: ["games", "xbox", "subscription"],
    status: "active",
    asset: {
      id: "asset-xbox-game-pass",
      productId: "00000000-0000-4000-8000-000000000005",
      filename: "xbox-game-pass-code.txt",
      sizeMb: 0.1,
      storagePath: "xbox-game-pass/code.txt",
    },
    createdAt: "2026-06-20T10:00:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000006",
    title: "Figma Professional",
    slug: "figma-professional",
    categorySlug: "software",
    categoryName: "Subscription • 1 year",
    description: "One year of Figma Professional access.",
    longDescription:
      "Figma Professional gives teams a full year of interface design, prototyping, and collaboration features.",
    imageUrl: "/products/figma-professional-tile.png",
    gallery: [
      "/products/figma-professional-tile.png",
      "/products/adobe-photoshop-2024-tile.png",
    ],
    priceCents: 4990,
    rating: 4.8,
    delivery: "Instant subscription delivery",
    fileTypes: ["SUBSCRIPTION"],
    license: "1 year subscription",
    compatibility: ["Figma", "Browser", "Design teams"],
    specs: [
      { label: "Duration", value: "1 year" },
      { label: "Delivery", value: "Digital access" },
      { label: "Use case", value: "UI design" },
    ],
    tags: ["figma", "design", "subscription"],
    status: "active",
    asset: {
      id: "asset-figma-professional",
      productId: "00000000-0000-4000-8000-000000000006",
      filename: "figma-professional-access.txt",
      sizeMb: 0.1,
      storagePath: "figma-professional/access.txt",
    },
    createdAt: "2026-06-22T10:00:00.000Z",
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
  return Array.from(new Set(values)).sort((left, right) =>
    left.localeCompare(right),
  );
}
