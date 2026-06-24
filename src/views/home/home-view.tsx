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

import { getStorefrontCategories } from "@/entities/category/repository";
import { getStorefrontProducts } from "@/entities/product/repository";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { buttonVariants } from "@/shared/ui/button";
import { ProductGrid } from "@/widgets/product-grid/product-grid";

export async function HomeView() {
  const [categories, products] = await Promise.all([
    getStorefrontCategories(),
    getStorefrontProducts(),
  ]);
  const featuredProducts = products.slice(0, 6);
  const heroProducts = products.slice(0, 4);

  return (
    <main className="overflow-hidden bg-[#050814] text-white">
      <section className="relative border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_30%,rgba(124,58,237,0.34),transparent_34%),radial-gradient(circle_at_85%_68%,rgba(6,182,212,0.14),transparent_24%),linear-gradient(180deg,rgba(5,8,20,0)_0%,rgba(5,8,20,1)_100%)]" />
        <div className="mx-auto grid min-h-[620px] w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_520px] lg:px-8 lg:py-16">
          <div className="relative z-10 flex max-w-3xl flex-col justify-center gap-7">
            <Badge className="w-fit border-violet-400/30 bg-violet-500/15 text-violet-200">
              <Zap className="mr-1 size-3" />
              Instant digital delivery
            </Badge>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-black leading-tight sm:text-6xl">
                Digital products for{" "}
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
                  work, games and creativity
                </span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Games, software, subscriptions, keys, templates, courses and
                more. Buy safely and get access instantly.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-[0_0_32px_rgba(124,58,237,0.48)] hover:from-violet-400 hover:to-blue-400",
                )}
              >
                Browse catalog
                <ArrowRight data-icon="inline-end" />
              </Link>
              <Link
                href="/account/orders"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white/10 bg-white/5 text-white hover:bg-white/10",
                )}
              >
                How it works
              </Link>
            </div>
            <div className="grid gap-4 pt-4 sm:grid-cols-3">
              <HeroFeature
                icon={Package}
                title="Instant delivery"
                body="Right after payment"
              />
              <HeroFeature
                icon={ShieldCheck}
                title="Secure payment"
                body="Protected checkout"
              />
              <HeroFeature
                icon={Headphones}
                title="24/7 support"
                body="Always in touch"
              />
            </div>
          </div>
          <HeroVault products={heroProducts} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid rounded-lg border border-white/10 bg-white/[0.04] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:grid-cols-2 lg:grid-cols-9">
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
          ].map(([label, Icon], index) => (
            <Link
              key={String(label)}
              href={index === 0 ? "/products" : `/products?search=${label}`}
              className={cn(
                "flex min-h-16 flex-col items-center justify-center gap-2 rounded-md px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white",
                index === 0 && "bg-violet-500/10 text-violet-300",
              )}
            >
              <Icon className="size-5" />
              <span>{String(label)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Popular products</h2>
            <p className="mt-2 text-sm text-slate-400">
              Best-selling keys, subscriptions and digital toolkits.
            </p>
          </div>
          <Link
            href="/products"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-white/10 bg-white/5 text-white hover:bg-white/10",
            )}
          >
            View all
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <h2 className="text-center text-2xl font-bold">
            Why choose{" "}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
              KeyHub?
            </span>
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-5">
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

      <section className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {categories.slice(0, 3).map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="rounded-lg border border-white/10 bg-white/[0.04] p-5 transition hover:border-violet-400/50 hover:bg-white/[0.07]"
            >
              <p className="font-semibold text-white">{category.name}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {category.description}
              </p>
            </Link>
          ))}
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
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-violet-300">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-slate-400">{body}</p>
      </div>
    </div>
  );
}

type HeroVaultProps = {
  products: Awaited<ReturnType<typeof getStorefrontProducts>>;
};

function HeroVault({ products }: HeroVaultProps) {
  return (
    <div className="relative z-10 hidden items-center justify-center lg:flex">
      <div className="relative h-[500px] w-full">
        <div className="absolute left-1/2 top-[58%] h-48 w-72 -translate-x-1/2 rounded-lg border border-violet-400/40 bg-[#11152b] shadow-[0_0_90px_rgba(124,58,237,0.58)]">
          <div className="absolute inset-x-6 top-6 h-16 rounded-md border border-violet-400/30 bg-violet-500/15" />
          <div className="absolute inset-x-10 bottom-8 rounded-md border border-violet-400/30 bg-[#080b19] py-4 text-center text-3xl font-black text-violet-400">
            KEYHUB
          </div>
        </div>
        <div className="absolute left-1/2 top-[54%] h-16 w-80 -translate-x-1/2 rounded-full bg-violet-500/50 blur-3xl" />
        {products.map((product, index) => (
          <div
            key={product.id}
            className={cn(
              "absolute overflow-hidden rounded-xl border border-cyan-300/25 bg-white/10 p-2 shadow-[0_0_38px_rgba(34,211,238,0.22)] backdrop-blur",
              index === 0 && "left-20 top-20 rotate-[-10deg]",
              index === 1 && "right-20 top-28 rotate-[12deg]",
              index === 2 && "left-32 top-52 rotate-[6deg]",
              index === 3 && "right-32 top-60 rotate-[-8deg]",
            )}
          >
            <Image
              src={product.imageUrl}
              alt={product.title}
              width={150}
              height={190}
              className="h-40 w-28 rounded-lg object-cover"
            />
          </div>
        ))}
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
      <Icon className="mx-auto size-8 text-violet-400" />
      <h3 className="mt-4 font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-40 text-sm leading-6 text-slate-400">
        {body}
      </p>
    </div>
  );
}
