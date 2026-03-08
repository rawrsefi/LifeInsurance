import type { Metadata } from "next";
import Image from "next/image";
import HeroCTA from "@/components/HeroCTA";
import CTABlock from "@/components/CTABlock";
import FAQSection from "@/components/FAQSection";
import { generateFAQSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About AEG - Assurity Enterprise Group",
  description:
    "Learn about Assurity Enterprise Group — your trusted partner in life insurance and annuity solutions. Our mission, values, and commitment to protecting families.",
};

const ABOUT_FAQS = [
  {
    question: "Is Assurity Enterprise Group a licensed insurance provider?",
    answer:
      "Yes. Assurity Enterprise Group works with licensed insurance professionals who are authorized to provide life insurance and annuity solutions across multiple states. We partner with top-rated insurance carriers to bring you the best coverage options available.",
  },
  {
    question: "How does AEG select which insurance products to recommend?",
    answer:
      "We take an independent, client-first approach. Our advisors analyze your specific financial situation, goals, and budget before recommending any products. We work with multiple carriers so we can match you with the policy that genuinely fits your needs — not the one that pays us the highest commission.",
  },
  {
    question: "Does it cost anything to get a quote from AEG?",
    answer:
      "Getting a quote from AEG is completely free with no obligation. Our consultations are designed to educate you on your options so you can make an informed decision. We believe that understanding your coverage should never come with a price tag.",
  },
  {
    question: "What areas does Assurity Enterprise Group serve?",
    answer:
      "We serve clients across the United States. Whether you are looking for term life insurance, whole life coverage, universal life, or annuity products, our team can help you find the right solution regardless of your location.",
  },
];

const VALUES = [
  {
    title: "Client-First Always",
    description:
      "Every recommendation we make starts with your needs, not ours. We take the time to understand your financial goals, family situation, and budget before suggesting any product.",
  },
  {
    title: "Transparency Without Exception",
    description:
      "Insurance can be confusing. We break down every policy, every fee, and every detail in plain language so you know exactly what you are getting and what you are paying for.",
  },
  {
    title: "Education Over Sales",
    description:
      "We believe an informed client is our best client. That is why we invest heavily in educational content, free consultations, and honest guidance — so you make decisions with confidence.",
  },
  {
    title: "Long-Term Relationships",
    description:
      "Your insurance needs change as your life changes. We do not disappear after the sale. Our team is here for annual reviews, life event adjustments, and ongoing support.",
  },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(ABOUT_FAQS)) }}
      />

      <HeroCTA
        headline="We Protect Families. That's Our Entire Mission."
        subheadline="Assurity Enterprise Group was built on a simple belief: every family deserves access to honest, affordable life insurance guidance from advisors who actually care."
        ctaText="Get Your Free Quote"
        secondaryText="See Our Solutions"
        secondaryHref="/life-insurance"
      />

      {/* Our Story */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold text-brand-purple uppercase tracking-wider mb-3">Our Story</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Born from a Frustration with the Insurance Industry
              </h2>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                The insurance industry has a trust problem. Too many families get pressured into policies they do not need by agents chasing commissions. Too many people avoid life insurance entirely because the process feels overwhelming, confusing, or predatory.
              </p>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                Assurity Enterprise Group exists to change that. We built a team of licensed professionals who lead with education, not pressure. Advisors who take the time to understand your unique situation before recommending anything. A company where the only metric that matters is whether your family is truly protected.
              </p>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                Today, we help thousands of families across the country navigate life insurance and annuity decisions with clarity and confidence. Every quote is free. Every conversation is honest. Every recommendation is backed by independent research.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                alt="Professional team collaborating in a modern office environment"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 bg-brand-bg">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What We Stand For</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              These are not just words on a wall. They guide every client interaction, every recommendation, and every decision we make.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {VALUES.map((value) => (
              <div key={value.title} className="rounded-xl bg-white p-8 border border-gray-100">
                <div className="w-10 h-1 bg-brand-purple rounded mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "15,000+", label: "Families Served" },
              { value: "$2.5B+", label: "Total Coverage Placed" },
              { value: "50+", label: "Insurance Carrier Partners" },
              { value: "4.9/5", label: "Average Client Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold text-brand-purple">{stat.value}</p>
                <p className="text-sm text-brand-gray mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection faqs={ABOUT_FAQS} />
      <CTABlock
        headline="Ready to Work with a Team That Puts You First?"
        description="Get your free, no-obligation life insurance quote from advisors who genuinely care about protecting your family."
      />
    </>
  );
}
