import Link from "next/link";

interface CTABlockProps {
  headline?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function CTABlock({
  headline = "Ready to Protect What Matters Most?",
  description = "Get a personalized life insurance quote in minutes. Our advisors are here to help you find the right coverage for your family.",
  ctaText = "Get Your Free Quote Today",
  ctaHref = "/contact",
}: CTABlockProps) {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="rounded-2xl bg-gradient-to-br from-brand-purple to-brand-purple-dark p-10 md:p-16 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{headline}</h2>
          <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">{description}</p>
          <Link href={ctaHref} className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-semibold text-brand-purple hover:bg-gray-100 transition-colors">
            {ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
}
