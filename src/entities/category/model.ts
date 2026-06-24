import type { Category } from "@/shared/types/catalog";

export const categories: Category[] = [
  {
    id: "cat-games",
    name: "Games",
    slug: "games",
    description: "Game keys and passes with instant activation.",
    imageUrl: "/products/elden-ring-tile.png",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "cat-subscriptions",
    name: "Subscriptions",
    slug: "subscriptions",
    description: "Monthly and yearly access to popular digital services.",
    imageUrl: "/products/chatgpt-plus-tile.png",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "cat-software",
    name: "Software",
    slug: "software",
    description: "Professional licenses for work and creativity.",
    imageUrl: "/products/adobe-photoshop-2024-tile.png",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "cat-keys",
    name: "Keys",
    slug: "keys",
    description: "Activation keys for operating systems, games, and apps.",
    imageUrl: "/products/windows-11-pro-tile.png",
    isActive: true,
    sortOrder: 4,
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}
