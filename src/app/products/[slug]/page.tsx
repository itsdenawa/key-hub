import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { products } from "@/entities/product/model";
import {
  getStorefrontProductBySlug,
  getStorefrontRelatedProducts,
} from "@/entities/product/repository";
import { ProductDetailView } from "@/views/product-detail/product-detail-view";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getStorefrontProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: product.title,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getStorefrontProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <ProductDetailView
      product={product}
      relatedProducts={await getStorefrontRelatedProducts(product)}
    />
  );
}
