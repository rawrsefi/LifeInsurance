import Link from "next/link";
import Image from "next/image";

const FOOTER_LINKS = {
  Insurance: [
    { href: "/life-insurance", label: "Life Insurance" },
    { href: "/annuities", label: "Annuities" },
    { href: "/contact", label: "Get a Quote" },
  ],
  Resources: [
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image src="/images/aeg-logo.png" alt="AEG" width={40} height={40} className="h-9 w-auto brightness-200" />
              <span className="text-lg font-bold text-white">Assurity Enterprise Group</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-md">
              Your trusted partner in life insurance and annuity solutions. We help families and individuals
              build financial security with personalized coverage plans tailored to your unique needs.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm hover:text-brand-purple-light transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Assurity Enterprise Group. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Life insurance and annuity products are not FDIC insured and involve risk.
          </p>
        </div>
      </div>
    </footer>
  );
}
