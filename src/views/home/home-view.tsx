import {
  ArrowRight,
  Gamepad2,
  Grid3X3,
  Headphones,
  KeyRound,
  Layers3,
  Music,
  Package,
  Palette,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Tag,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getStorefrontProducts } from "@/entities/product/repository";
import { AddToCartButton } from "@/features/cart/add-to-cart-button";
import { formatMoney } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";
import type { Product } from "@/shared/types/catalog";
import { Badge } from "@/shared/ui/badge";
import { buttonVariants } from "@/shared/ui/button";

export async function HomeView() {
  const products = await getStorefrontProducts();
  const featuredProducts = products.slice(0, 6);

  return (
    <main className="overflow-hidden bg-[#050814] text-white">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#050814_0%,rgba(5,8,20,0.96)_42%,rgba(5,8,20,0.5)_70%,#050814_100%),radial-gradient(circle_at_75%_42%,rgba(124,58,237,0.42),transparent_36%),radial-gradient(circle_at_88%_66%,rgba(6,182,212,0.16),transparent_24%)]" />
        <HeroVault />
        <div className="mx-auto min-h-[470px] w-full max-w-[948px] px-4 py-6 sm:px-6 lg:px-0 lg:py-0">
          <div className="relative z-10 flex max-w-[560px] flex-col justify-center gap-5">
            <Badge className="w-fit rounded-full border-violet-400/30 bg-violet-500/18 px-3 py-1 text-[11px] font-bold uppercase text-violet-200">
              <Zap className="mr-1 size-3" />
              Instant digital delivery
            </Badge>
            <div className="space-y-4">
              <h1 className="max-w-[560px] text-[38px] font-black leading-[1.16] sm:text-[37px] lg:text-[37px]">
                Digital products
                <br />
                for{" "}
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
                  work, games & creativity
                </span>
              </h1>
              <p className="max-w-[520px] text-[15px] leading-7 text-slate-300">
                Games, software, subscriptions, keys, templates, courses and
                more.
                <br />
                Buy and get access instantly.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 rounded-lg bg-gradient-to-r from-violet-500 to-blue-500 px-7 text-base font-bold text-white shadow-[0_0_34px_rgba(124,58,237,0.58)] hover:from-violet-400 hover:to-blue-400",
                )}
              >
                Go to catalog
                <ArrowRight data-icon="inline-end" />
              </Link>
              <Link
                href="/account/orders"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 rounded-lg border-white/15 bg-white/[0.045] px-7 text-base font-bold text-white hover:bg-white/10",
                )}
              >
                How it works
              </Link>
            </div>
            <div className="grid max-w-[560px] gap-4 pt-2 sm:grid-cols-3">
              <HeroFeature
                icon={Package}
                title="Instant delivery"
                body="Immediately after payment"
              />
              <HeroFeature
                icon={ShieldCheck}
                title="Secure payment"
                body="Encrypted checkout"
              />
              <HeroFeature
                icon={Headphones}
                title="24/7 support"
                body="Always in touch"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 mx-auto -mt-7 w-full max-w-[948px] px-4 sm:px-6 lg:px-0">
        <div className="grid overflow-hidden rounded-lg border border-white/10 bg-[#0b1020]/92 px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_60px_rgba(0,0,0,0.32)] backdrop-blur sm:grid-cols-2 lg:grid-cols-10">
          {[
            ["Popular", Sparkles],
            ["Games", Gamepad2],
            ["Subscriptions", Package],
            ["Software", Layers3],
            ["Keys", KeyRound],
            ["Templates", Grid3X3],
            ["Courses", Package],
            ["Audio", Music],
            ["Graphics", Palette],
            ["All categories", Grid3X3],
          ].map(([label, Icon], index) => (
            <Link
              key={String(label)}
              href={index === 0 ? "/products" : `/products?search=${label}`}
              className={cn(
                "relative flex min-h-[78px] flex-col items-center justify-center gap-2 px-2 py-2 text-xs text-slate-300 transition hover:bg-white/[0.04] hover:text-white lg:border-l lg:border-white/8 lg:first:border-l-0",
                index === 0 &&
                  "text-violet-300 after:absolute after:bottom-0 after:h-0.5 after:w-16 after:rounded-full after:bg-violet-500",
              )}
            >
              <Icon className="size-6" />
              <span>{String(label)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[948px] px-4 pb-8 pt-9 sm:px-6 lg:px-0">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Popular products</h2>
          </div>
          <Link
            href="/products"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 rounded-lg border-white/10 bg-white/[0.045] px-5 text-white hover:bg-white/10",
            )}
          >
            View all
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {featuredProducts.map((product) => (
            <HomeProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[948px] px-4 pb-8 sm:px-6 lg:px-0">
        <div className="rounded-lg border border-white/10 bg-[#0b1020]/80 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <h2 className="text-center text-xl font-bold">
            Why choose{" "}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
              KeyHub?
            </span>
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-5">
            <WhyCard
              icon={Zap}
              title="Instant delivery"
              body="Get your product right after payment."
            />
            <WhyCard
              icon={ShieldCheck}
              title="Security"
              body="Verified sellers and protected payments."
            />
            <WhyCard
              icon={Tag}
              title="Better prices"
              body="Hand-picked offers for digital products."
            />
            <WhyCard
              icon={Headphones}
              title="24/7 support"
              body="We are ready to help whenever needed."
            />
            <WhyCard
              icon={RefreshCw}
              title="Refund guarantee"
              body="Clear return policy if something goes wrong."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

type IconComponent = React.ComponentType<{ className?: string }>;

type HeroFeatureProps = {
  body: string;
  icon: IconComponent;
  title: string;
};

function HeroFeature({ body, icon: Icon, title }: HeroFeatureProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-violet-300">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-slate-400">{body}</p>
      </div>
    </div>
  );
}

function HeroVault() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 hidden bg-[url('/hero/keyhub-hero-background.png')] bg-cover bg-center bg-no-repeat 2xl:bg-[length:auto_620px] 2xl:bg-[position:calc(50%+180px)_top] lg:block" />
  );
}

type HomeProductCardProps = {
  product: Product;
};

function HomeProductCard({ product }: HomeProductCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg border border-white/10 bg-[#0d1325] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:-translate-y-0.5 hover:border-violet-400/50">
      <Link
        href={`/products/${product.slug}`}
        className="relative block overflow-hidden bg-[#10172a]"
      >
        <Image
          src={product.imageUrl}
          alt={product.title}
          width={420}
          height={360}
          className="aspect-[1.02] w-full object-cover transition duration-300 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1325]/70 via-transparent to-transparent" />
      </Link>
      <div className="p-3">
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 min-h-9 text-sm font-semibold leading-[18px] text-white hover:text-violet-300"
        >
          {product.title}
        </Link>
        <p className="mt-1 line-clamp-1 text-xs text-slate-400">
          {product.categoryName}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-base font-black text-white">
            {formatMoney(product.priceCents)}
          </p>
          <AddToCartButton
            product={product}
            size="icon"
            showLabel={false}
            className="size-8 border border-white/10 bg-white/[0.055] text-white hover:bg-violet-500/20"
          />
        </div>
      </div>
    </div>
  );
}

type WhyCardProps = {
  body: string;
  icon: IconComponent;
  title: string;
};

function WhyCard({ body, icon: Icon, title }: WhyCardProps) {
  return (
    <div className="border-white/10 text-center md:border-l md:first:border-l-0">
      <Icon className="mx-auto size-6 text-violet-400" />
      <h3 className="mt-3 text-sm font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-40 text-xs leading-5 text-slate-400">
        {body}
      </p>
    </div>
  );
}
