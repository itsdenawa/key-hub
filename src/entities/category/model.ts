import type { Category } from "@/shared/types/catalog";

export const categories: Category[] = [
  {
    id: "cat-productivity",
    name: "Productivity",
    slug: "productivity",
    description: "Templates and systems for sharper solo workflows.",
    imageUrl: "/products/automation-key.png",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "cat-design",
    name: "Design",
    slug: "design",
    description: "UI kits, tokens, and premium design resources.",
    imageUrl: "/products/design-vault.png",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "cat-developer",
    name: "Developer",
    slug: "developer",
    description: "Code starters, launch kits, and developer assets.",
    imageUrl: "/products/dev-pack.png",
    isActive: true,
    sortOrder: 3,
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}
