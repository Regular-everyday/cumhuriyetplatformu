"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-gold/30 bg-white/95 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/logo.png"
            alt="Mersin Cumhuriyet Platformu"
            width={56}
            height={56}
            className="rounded-full"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-bold leading-tight text-brand-red">
              MERSİN CUMHURİYET
            </p>
            <p className="text-xs font-semibold text-brand-gold">PLATFORMU</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-brand-red/5 hover:text-brand-red dark:text-gray-300 dark:hover:bg-brand-red/20 dark:hover:text-brand-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link href="/uyelik" className="btn-primary hidden text-sm md:inline-flex">
            Üye Ol
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-brand-red lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-gray-100 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-950 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-brand-red/5 hover:text-brand-red dark:text-gray-300 dark:hover:bg-brand-red/20 dark:hover:text-brand-gold"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/uyelik"
              className="btn-primary mt-2 text-center text-sm"
              onClick={() => setMenuOpen(false)}
            >
              Üye Ol
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
