import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import HeroCTA from "@/components/HeroCTA";
import TestimonialBlock from "@/components/TestimonialBlock";
import FAQSection from "@/components/FAQSection";
import CTABlock from "@/components/CTABlock";
import BlogCard from "@/components/BlogCard";
import { generateFAQSchema } from "@/lib/seo";
import { getAllPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "AEG - Assurity Enterprise Group | Life Insurance & Annuities",
  description:
    "Protect your family's future with trusted life insurance and annuity solutions from Assurity Enterprise Group. Personalized coverage, expert guidance, free quotes.",
  keywords: [
    "life insurance",
    "annuities",
    "term life insurance",
    "whole life insurance",
    "life insurance quotes",
    "annuity rates",
  ],
};

const TESTIMONIALS = [
  {
    quote:
      "AEG made the entire process simple. Within a week, my family had the coverage we needed and the peace of mind we deserved. I only wish I had started sooner.",
    name: "Sarah M.",
    role: "Mother of three, Austin TX",
  },
  {
    quote:
      "After comparing options for months, AEG's advisors helped me understand the real differences between policies. Their honesty saved me thousands over the life of my plan.",
    name: "David R.",
    role: "Small business owner, Denver CO",
  },
  {
    quote:
      "My husband and I were overwhelmed by choices until AEG walked us through everything. The annuity plan they recommended has been exactly what we needed for retirement.",
    name: "Linda & James K.",
    role: "Retired couple, Phoenix AZ",
  },
];

const HOME_FAQS = [
  {
    question: "How much life insurance coverage do I need?",
    answer:
      "Most financial experts recommend coverage worth 10 to 15 times your annual income. However, the right amount depends on your specific situation including debts, dependents, future education costs, and your spouse's income. Our advisors provide a personalized analysis at no cost to help you determine the exact coverage amount your family needs.",
  },
  {
    question: "What is the difference between term and whole life insurance?",
    answer:
      "Term life insurance provides coverage for a specific period (typically 10, 20, or 30 years) and is generally more affordable. Whole life insurance covers you for your entire life, builds cash value over time, and has fixed premiums. Term is ideal if you need coverage during your working years, while whole life suits those wanting lifelong protection with an investment component.",
  },
  {
    question: "How do annuities work for retirement income?",
    answer:
      "An annuity is a contract with an insurance company where you make a lump sum payment or series of payments in exchange for guaranteed regular income in the future. During the accumulation phase, your money grows tax-deferred. During the payout phase, you receive steady income that can last for life. Annuities are designed to address the risk of outliving your savings.",
  },
  {
    question: "Can I get life insurance without a medical exam?",
    answer:
      "Yes. Several types of life insurance policies are available without a medical exam, including simplified issue and guaranteed issue policies. While these policies may have higher premiums or lower coverage limits, they provide a fast path to protection — often with approval in 24 to 48 hours. Our advisors can help you find the right no-exam option for your situation.",
  },
  {
    question: "How quickly can I get a life insurance quote?",
    answer:
      "You can receive a preliminary quote within minutes by filling out our online form. A licensed advisor will follow up within 24 hours to discuss your options in detail, answer questions, and help you finalize coverage that fits your budget and goals. There is no obligation and no cost for the consultation.",
  },
];

const SERVICES = [
  {
    title: "Term Life Insurance",
    description: "Affordable protection for your family during the years that matter most. Lock in low rates for 10, 20, or 30 years.",
    href: "/life-insurance",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    ),
  },
  {
    title: "Whole Life Insurance",
    description: "Lifelong coverage with guaranteed cash value growth. Build wealth while protecting your loved ones.",
    href: "/life-insurance",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    ),
  },
  {
    title: "No-Exam Life Insurance",
    description: "Get covered in as little as 24 hours with no medical exam required. Fast approval, reliable protection.",
    href: "/life-insurance",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    ),
  },
  {
    title: "Annuities",
    description: "Secure guaranteed retirement income that lasts as long as you do. Tax-deferred growth with flexible payout options.",
    href: "/annuities",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
  },
];

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(HOME_FAQS)) }}
      />

      <HeroCTA
        headline="Protect Your Family's Future with Confidence"
        subheadline="Life insurance and annuity solutions tailored to your needs. Because the people you love deserve financial security — no matter what tomorrow brings."
        ctaText="Get Your Free Quote"
        ctaHref="/contact"
        tertiaryText="Apply Now"
        tertiaryHref="/apply"
        secondaryText="Explore Our Solutions"
        secondaryHref="/life-insurance"
        backgroundImage="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1400&q=80"
      />

      {/* Trust Indicators */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "15,000+", label: "Families Protected" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "$2.5B+", label: "Coverage Placed" },
              { value: "24hrs", label: "Average Quote Time" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-brand-purple">{stat.value}</p>
                <p className="text-sm text-brand-gray mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Point Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                You Work Hard for Your Family. <span className="text-brand-purple">Make Sure They&apos;re Protected.</span>
              </h2>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Every 30 seconds, a family in America faces a financial crisis because they lacked adequate life insurance. The bills don&apos;t stop. The mortgage doesn&apos;t pause. Your children&apos;s education doesn&apos;t wait.
              </p>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                Yet 40% of American adults have no life insurance at all. If something unexpected happened to you tomorrow, would your family be financially secure?
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Replace your income so your family maintains their lifestyle",
                  "Pay off your mortgage, debts, and final expenses",
                  "Fund your children's education, even if you're not there",
                  "Leave a legacy that lasts for generations",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="h-5 w-5 mt-0.5 text-brand-purple shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="inline-flex items-center mt-8 rounded-lg bg-brand-purple px-6 py-3 text-sm font-semibold text-white hover:bg-brand-purple-dark transition-colors">
                Find Out What You Need &rarr;
              </Link>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?w=800&q=80"
                alt="Happy family spending time together in their home"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-20 bg-brand-bg">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Insurance Solutions Built Around You</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you need affordable term coverage or guaranteed retirement income, we have a solution that fits your life and your budget.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((service) => (
              <Link key={service.title} href={service.href} className="group rounded-xl bg-white p-8 border border-gray-100 hover:shadow-lg hover:border-brand-purple/20 transition-all">
                <div className="text-brand-purple mb-4">{service.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-purple transition-colors">{service.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Get Covered in 3 Simple Steps</h2>
            <p className="mt-4 text-lg text-gray-600">No complicated paperwork. No pushy sales calls. Just straightforward protection.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Tell Us About Yourself", description: "Fill out our simple online form. It takes less than 2 minutes and there is zero obligation." },
              { step: "02", title: "Review Your Options", description: "A licensed advisor contacts you within 24 hours with personalized recommendations that fit your budget." },
              { step: "03", title: "Get Protected", description: "Choose your plan and get covered. Many policies are approved within 24 to 48 hours — some instantly." },
            ].map((item) => (
              <div key={item.step} className="text-center p-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-purple/10 text-brand-purple font-bold text-lg mb-6">{item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialBlock testimonials={TESTIMONIALS} />

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Latest Insurance Insights</h2>
              <Link href="/blog" className="text-sm font-medium text-brand-purple hover:underline">View all articles &rarr;</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <BlogCard key={post.slug} {...post} />
              ))}
            </div>
          </div>
        </section>
      )}

      <FAQSection faqs={HOME_FAQS} />
      <CTABlock />
    </>
  );
}
