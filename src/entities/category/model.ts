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
  {
    id: "cat-templates",
    name: "Templates",
    slug: "templates",
    description: "Design systems, UI kits, and productivity templates.",
    imageUrl: "/products/design-vault.png",
    isActive: true,
    sortOrder: 5,
  },
  {
    id: "cat-courses",
    name: "Courses",
    slug: "courses",
    description: "Compact learning packs for technical and creative skills.",
    imageUrl: "/products/dev-pack.png",
    isActive: true,
    sortOrder: 6,
  },
  {
    id: "cat-audio",
    name: "Audio",
    slug: "audio",
    description: "Audio packs, loops, and production tools.",
    imageUrl: "/products/automation-key.png",
    isActive: true,
    sortOrder: 7,
  },
  {
    id: "cat-graphics",
    name: "Graphics",
    slug: "graphics",
    description: "Creative assets for visual production.",
    imageUrl: "/products/figma-professional-tile.png",
    isActive: true,
    sortOrder: 8,
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}
