import Link from "next/link";

interface HeroCTAProps {
  headline: string;
  subheadline: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
  tertiaryText?: string;
  tertiaryHref?: string;
  backgroundImage?: string;
}

export default function HeroCTA({
  headline,
  subheadline,
  ctaText = "Get Your Free Quote",
  ctaHref = "/contact",
  secondaryText,
  secondaryHref,
  tertiaryText,
  tertiaryHref,
  backgroundImage,
}: HeroCTAProps) {
  return (
    <section
      className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
    >
      {backgroundImage && <div className="absolute inset-0 bg-gray-900/70" />}
      <div className="absolute top-0 left-0 w-full h-1 bg-brand-purple" />
      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 lg:py-40">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            {headline}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
            {subheadline}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row sm:flex-wrap gap-4">
            <Link href={ctaHref} className="inline-flex items-center justify-center rounded-lg bg-brand-purple px-8 py-4 text-base font-semibold text-white hover:bg-brand-purple-dark transition-colors">
              {ctaText}
            </Link>
            {tertiaryText && tertiaryHref && (
              <Link href={tertiaryHref} className="inline-flex items-center justify-center rounded-lg bg-white/10 px-8 py-4 text-base font-semibold text-white hover:bg-white/20 transition-colors">
                {tertiaryText}
              </Link>
            )}
            {secondaryText && secondaryHref && (
              <Link href={secondaryHref} className="inline-flex items-center justify-center rounded-lg border border-white/20 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-colors">
                {secondaryText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
