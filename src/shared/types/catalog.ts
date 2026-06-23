export type ProductStatus = "draft" | "active" | "archived";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
};

export type ProductAsset = {
  id: string;
  productId: string;
  filename: string;
  sizeMb: number;
  storagePath: string;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  gallery: string[];
  priceCents: number;
  rating: number;
  delivery: string;
  fileTypes: string[];
  license: string;
  status: ProductStatus;
  asset: ProductAsset;
  createdAt: string;
};

export type CatalogSort = "featured" | "newest" | "price-asc" | "price-desc";
