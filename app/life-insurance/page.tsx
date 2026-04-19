import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import HeroCTA from "@/components/HeroCTA";
import FAQSection from "@/components/FAQSection";
import CTABlock from "@/components/CTABlock";
import TestimonialBlock from "@/components/TestimonialBlock";
import { generateFAQSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Life Insurance: Your Complete Guide",
  description:
    "Understand every type of life insurance — term, whole, universal, and no-exam policies. Learn what you need, what it costs, and how to protect your family today.",
  keywords: [
    "life insurance",
    "term life insurance",
    "whole life insurance",
    "universal life insurance",
    "no exam life insurance",
    "life insurance types",
    "life insurance cost",
    "life insurance for families",
  ],
};

const LI_FAQS = [
  {
    question: "What is life insurance and why do you need it?",
    answer:
      "Life insurance is a contract between you and an insurance company. You pay regular premiums, and in exchange, the insurer pays a death benefit to your beneficiaries when you pass away. You need it to replace your income, pay off debts, cover funeral costs, fund your children's education, and ensure your family maintains their quality of life without your financial contribution.",
  },
  {
    question: "How much does life insurance cost per month?",
    answer:
      "Life insurance costs vary based on your age, health, coverage amount, and policy type. A healthy 30-year-old can get $500,000 in term life coverage for as little as $20 to $30 per month. Whole life insurance costs more — typically 5 to 15 times the cost of an equivalent term policy — because it provides lifelong coverage and builds cash value. Your actual rate depends on factors like tobacco use, medical history, and occupation.",
  },
  {
    question: "What is the difference between term and whole life insurance?",
    answer:
      "Term life insurance provides coverage for a set period (10, 20, or 30 years) and is the most affordable option. If you die during the term, your beneficiaries receive the death benefit. If the term expires while you are alive, coverage ends. Whole life insurance covers your entire life, never expires, has fixed premiums, and builds cash value you can borrow against. Term is best for temporary needs like mortgage protection, while whole life is suited for permanent needs like estate planning.",
  },
  {
    question: "Can you get life insurance without a medical exam?",
    answer:
      "Yes. Simplified issue policies require only a health questionnaire without a physical exam, and guaranteed issue policies accept everyone regardless of health. No-exam policies typically have higher premiums and lower maximum coverage amounts (usually $50,000 to $500,000) compared to fully underwritten policies. They are ideal if you need coverage quickly, have health concerns that make traditional underwriting difficult, or simply prefer a faster process.",
  },
  {
    question: "What does life insurance not cover?",
    answer:
      "Most life insurance policies exclude deaths caused by suicide within the first two years (the contestability period), fraud or material misrepresentation on the application, death while committing a felony, and in some cases, deaths in war zones or from specific high-risk activities. Standard policies do cover death from illness, accidents, natural causes, and most other circumstances after the contestability period.",
  },
  {
    question: "How many life insurance policies can you have?",
    answer:
      "There is no legal limit on the number of life insurance policies you can own. Many people hold multiple policies to cover different needs — for example, a large term policy to replace income during working years plus a smaller whole life policy for final expenses. Insurers will evaluate your total coverage to ensure it is reasonable relative to your income, but owning two to three policies is common and perfectly acceptable.",
  },
];

const POLICY_TYPES = [
  {
    title: "Term Life Insurance",
    description: "The most straightforward and affordable type. You pick a coverage period — 10, 20, or 30 years — and pay a fixed premium. If you die during the term, your beneficiaries receive the full death benefit tax-free. If you outlive the term, coverage ends (though many policies are convertible to whole life).",
    best: "Young families, mortgage protection, income replacement during working years",
    cost: "$20–$50/month for $500K (healthy 30-year-old)",
    image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=600&q=80",
    imageAlt: "Young couple reviewing insurance documents together",
  },
  {
    title: "Whole Life Insurance",
    description: "Permanent coverage that lasts your entire life. Premiums are fixed and a portion of each payment builds tax-deferred cash value you can borrow against. The death benefit is guaranteed and never decreases. Whole life functions as both protection and a conservative savings vehicle.",
    best: "Estate planning, lifelong coverage needs, wealth transfer, supplemental retirement savings",
    cost: "$150–$400/month for $500K (healthy 30-year-old)",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
    imageAlt: "Multi-generational family enjoying time together outdoors",
  },
  {
    title: "Universal Life Insurance",
    description: "Flexible permanent insurance that lets you adjust your premiums and death benefit as your needs change. Like whole life, it builds cash value — but the growth rate varies based on market conditions or a fixed interest rate, depending on the type (indexed or variable). This flexibility makes it adaptable to life changes.",
    best: "People who want permanent coverage with adjustable premiums and potential for higher cash value growth",
    cost: "$100–$300/month for $500K (varies by type)",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=80",
    imageAlt: "Business professional reviewing financial plan at desk",
  },
  {
    title: "No-Exam Life Insurance",
    description: "Coverage without a medical exam — approval in as little as 24 hours. Simplified issue policies use a health questionnaire, while guaranteed issue policies accept everyone regardless of health conditions. Coverage amounts are typically lower and premiums are higher than fully underwritten policies, but the speed and accessibility make them valuable for many people.",
    best: "People with health conditions, those who need fast coverage, anyone who wants to skip the medical exam process",
    cost: "$30–$100/month for $250K (varies widely by health)",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80",
    imageAlt: "Person using a tablet to apply for insurance online",
  },
];

const TESTIMONIALS = [
  {
    quote: "I thought life insurance was complicated and expensive until AEG broke it down for me. I got a $750K term policy for less than my streaming subscriptions cost.",
    name: "Marcus T.",
    role: "Father of two, Atlanta GA",
  },
  {
    quote: "As a single mom, I needed to know my kids would be okay. AEG found me a no-exam policy that was approved in 2 days. The peace of mind is priceless.",
    name: "Jennifer L.",
    role: "Nurse, San Diego CA",
  },
  {
    quote: "We were paying too much for a whole life policy we did not fully understand. AEG helped us restructure our coverage and saved us $200 a month without losing protection.",
    name: "Robert & Karen S.",
    role: "Married couple, Chicago IL",
  },
];

export default function LifeInsurancePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(LI_FAQS)) }}
      />

      <HeroCTA
        headline="Life Insurance That Actually Makes Sense"
        subheadline="No jargon. No pressure. Just clear answers about the coverage your family needs and what it really costs. Let us help you make the right choice."
        backgroundImage="https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=1400&q=80"
        secondaryText="Get a Free Quote"
        secondaryHref="/contact"
      />

      {/* Why Life Insurance Matters */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              If You Earn an Income, Someone Depends on It
            </h2>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Here is the reality most people do not want to think about: <strong>the average American funeral costs $7,848</strong>. The average mortgage balance is $244,498. The average cost to raise a child to 18 is $310,605. Without life insurance, your family faces these numbers alone.
            </p>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              Life insurance is not about you — it is about the people who depend on your income. It replaces your paycheck, pays off your debts, and ensures your children&apos;s future stays on track even if you are no longer there to provide. <strong>For pennies on the dollar, you buy your family years of financial stability.</strong>
            </p>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              The best time to get life insurance was 10 years ago. The second-best time is today. Every year you wait, premiums increase — and your health is never more insurable than it is right now.
            </p>
          </div>
        </div>
      </section>

      {/* Policy Types */}
      <section className="py-16 md:py-20 bg-brand-bg">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Types of Life Insurance Explained</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Each type of life insurance serves a different purpose. Understanding the differences is the first step toward choosing the right policy for your family.
            </p>
          </div>

          <div className="space-y-16">
            {POLICY_TYPES.map((policy, i) => (
              <div key={policy.title} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 !== 0 ? "lg:direction-rtl" : ""}`}>
                <div className={i % 2 !== 0 ? "lg:order-2" : ""}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{policy.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{policy.description}</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-sm font-semibold text-brand-purple shrink-0 mt-0.5">Best For:</span>
                      <span className="text-sm text-gray-600">{policy.best}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-sm font-semibold text-brand-purple shrink-0 mt-0.5">Typical Cost:</span>
                      <span className="text-sm text-gray-600">{policy.cost}</span>
                    </div>
                  </div>
                </div>
                <div className={`relative h-72 rounded-xl overflow-hidden ${i % 2 !== 0 ? "lg:order-1" : ""}`}>
                  <Image src={policy.image} alt={policy.imageAlt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Life Insurance at a Glance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-brand-bg">
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Feature</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Term Life</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Whole Life</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Universal Life</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  ["Coverage Duration", "10–30 years", "Lifetime", "Lifetime"],
                  ["Premiums", "Lowest", "Fixed, higher", "Flexible"],
                  ["Cash Value", "No", "Yes, guaranteed growth", "Yes, variable growth"],
                  ["Death Benefit", "Fixed", "Fixed", "Adjustable"],
                  ["Best For", "Temporary needs", "Lifetime protection", "Flexibility"],
                  ["Complexity", "Simple", "Moderate", "Complex"],
                ].map(([feature, ...values]) => (
                  <tr key={feature} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{feature}</td>
                    {values.map((v, i) => (
                      <td key={i} className="px-6 py-4 text-gray-600">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <TestimonialBlock testimonials={TESTIMONIALS} />

      {/* Related Content */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Explore Life Insurance Topics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "What Does Life Insurance Not Cover?", href: "/blog/what-does-life-insurance-not-cover" },
              { title: "How Many Policies Can You Have?", href: "/blog/how-many-life-insurance-policies-can-you-have" },
              { title: "Which Policy Generates Immediate Cash Value?", href: "/blog/which-life-insurance-generates-immediate-cash-value" },
              { title: "Indexed Universal Life (IUL) Explained", href: "/blog/indexed-universal-life-insurance" },
              { title: "Key Person Life Insurance for Businesses", href: "/blog/key-person-life-insurance" },
              { title: "No-Exam & Simplified Issue Life Insurance", href: "/blog/no-exam-life-insurance" },
              { title: "Life Insurance for Parents", href: "/blog/life-insurance-for-parents" },
              { title: "Is Life Insurance Worth It?", href: "/blog/is-life-insurance-worth-it" },
              { title: "Term vs Whole Life Insurance", href: "/blog/term-vs-whole-life-insurance" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="group rounded-lg border border-gray-200 p-6 hover:border-brand-purple/30 hover:shadow-sm transition-all">
                <h3 className="font-semibold text-gray-900 group-hover:text-brand-purple transition-colors">{link.title}</h3>
                <span className="text-sm text-brand-purple mt-2 inline-block">Read more &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FAQSection faqs={LI_FAQS} />
      <CTABlock />
    </>
  );
}
