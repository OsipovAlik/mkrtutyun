"use client";

import { useEffect, useState } from "react";
import { eventConfig } from "@/lib/event-config";

const links = [
  { href: "#program", label: "Ծրագիր" },
  { href: "#blessing", label: "Մաղթանք" },
  { href: "#gallery", label: "Լուսանկարներ" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [first, second] = eventConfig.monogram;

  return (
    <header
      inert={!scrolled}
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-700 ${
        scrolled
          ? "border-b border-gold/20 bg-ivory/85 text-ink shadow-[0_1px_24px_-12px_rgba(55,53,47,0.25)] backdrop-blur-md"
          : "pointer-events-none -translate-y-2 opacity-0"
      }`}
    >
      <nav
        aria-label="Հիմնական նավարկում"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:h-16 sm:px-8"
      >
        <a
          href="#top"
          className="font-serif text-lg tracking-[0.2em] text-gold-ink"
          aria-label="Վերադառնալ սկիզբ"
        >
          {first}
          <span className="mx-1.5 text-sm text-gold">և</span>
          {second}
        </a>
        <div className="flex items-center gap-5 sm:gap-8">
          <ul className="hidden items-center gap-8 text-[0.8rem] tracking-[0.08em] text-muted md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="transition-colors hover:text-gold-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#rsvp"
            className="rounded-full border border-gold/60 px-4 py-1.5 text-[0.8rem] tracking-[0.06em] text-gold-ink transition-colors hover:bg-gold hover:text-ivory"
          >
            Պատասխանել
          </a>
        </div>
      </nav>
    </header>
  );
}
