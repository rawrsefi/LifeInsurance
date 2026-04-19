"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/life-insurance", label: "Life Insurance" },
  { href: "/annuities", label: "Annuities" },
  { href: "/blog", label: "Resources" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <nav className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/aeg-logo.png" alt="AEG - Assurity Enterprise Group" width={48} height={48} className="h-10 w-auto" />
          <span className="hidden sm:block text-lg font-bold text-brand-gray-dark tracking-tight">
            Assurity Enterprise Group
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-brand-gray hover:text-brand-purple transition-colors">
              {link.label}
            </Link>
          ))}
          <Link href="/apply" className="text-sm font-semibold text-brand-purple hover:text-brand-purple-dark transition-colors">
            Apply Now
          </Link>
          <Link href="/contact" className="rounded-lg bg-brand-purple px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-purple-dark transition-colors">
            Get Your Free Quote
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-brand-gray" aria-label="Toggle menu">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block text-sm font-medium text-brand-gray hover:text-brand-purple">
              {link.label}
            </Link>
          ))}
          <Link href="/apply" onClick={() => setOpen(false)} className="block text-sm font-semibold text-brand-purple text-center py-1">
            Apply Now
          </Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="block rounded-lg bg-brand-purple px-5 py-2.5 text-sm font-semibold text-white text-center hover:bg-brand-purple-dark">
            Get Your Free Quote
          </Link>
        </div>
      )}
    </header>
  );
}
