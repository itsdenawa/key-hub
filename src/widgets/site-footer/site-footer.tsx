import { KeyRound, Send } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/shared/config/site";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#050814]">
      <div className="mx-auto grid w-full max-w-[1290px] gap-10 px-4 py-9 text-sm text-muted-foreground sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr_1.6fr] lg:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex size-9 items-center justify-center rounded-md border border-cyan-300/40 bg-violet-500/18 text-cyan-300">
              <KeyRound className="size-4" />
            </span>
            <span className="text-xl font-black uppercase text-white">
              Key<span className="text-violet-400">Hub</span>
            </span>
          </Link>
          <p className="mt-5 max-w-56 leading-6">
            Digital goods store with instant delivery and protected downloads.
          </p>
          <p className="mt-10 text-xs">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
        <FooterColumn
          title="Customer"
          links={[
            ["How it works", "/products"],
            ["Guarantees", "/account/orders"],
            ["Refunds", "/account/orders"],
            ["Support", "/account/profile"],
          ]}
        />
        <FooterColumn
          title="Catalog"
          links={[
            ["Games", "/products?category=productivity"],
            ["Subscriptions", "/products"],
            ["Software", "/products?category=developer"],
            ["Keys", "/products"],
            ["Templates", "/products?category=design"],
          ]}
        />
        <FooterColumn
          title="About"
          links={[
            ["Store", "/products"],
            ["Reviews", "/products"],
            ["Contacts", "/account/profile"],
          ]}
        />
        <div>
          <h3 className="font-semibold text-white">Subscribe for deals</h3>
          <p className="mt-3 leading-6">
            Get the best digital offers and new drops first.
          </p>
          <form className="mt-5 flex gap-2">
            <Input placeholder="Your email" type="email" />
            <Button
              type="submit"
              aria-label="Subscribe"
              className="bg-gradient-to-r from-violet-500 to-blue-500 text-white"
            >
              <Send className="size-4" />
            </Button>
          </form>
          <div className="mt-8 flex flex-wrap gap-4 text-base font-semibold text-white/70">
            <span>VISA</span>
            <span>MC</span>
            <span>Apple Pay</span>
            <span>G Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

type FooterColumnProps = {
  title: string;
  links: Array<[string, string]>;
};

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h3 className="font-semibold text-white">{title}</h3>
      <div className="mt-4 grid gap-3">
        {links.map(([label, href]) => (
          <Link key={label} href={href} className="hover:text-white">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
