import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import HeroCTA from "@/components/HeroCTA";
import FAQSection from "@/components/FAQSection";
import CTABlock from "@/components/CTABlock";
import TestimonialBlock from "@/components/TestimonialBlock";
import { generateFAQSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Annuities: Your Complete Guide",
  description:
    "Understand how annuities work, the different types (fixed, variable, immediate, deferred), and whether an annuity is right for your retirement plan.",
  keywords: [
    "annuities",
    "fixed annuity",
    "variable annuity",
    "immediate annuity",
    "deferred annuity",
    "annuity vs ira",
    "annuity rates",
    "retirement income",
  ],
};

const ANNUITY_FAQS = [
  {
    question: "What is the basic function of an annuity?",
    answer:
      "An annuity is a financial contract between you and an insurance company. You pay a lump sum or series of premiums, and in return, the insurer guarantees you regular income payments — either immediately or starting at a future date. The basic function is to convert a pool of savings into a predictable, guaranteed income stream that can last for your entire lifetime, eliminating the risk of outliving your money.",
  },
  {
    question: "What happens when an annuity matures?",
    answer:
      "When an annuity reaches its maturity date, the accumulation phase ends and you must decide how to receive your funds. Your options typically include annuitizing the contract (converting it to guaranteed income payments), taking a lump sum withdrawal, rolling the funds into a new annuity, or extending the existing contract. The best choice depends on your income needs, tax situation, and financial goals at the time of maturity.",
  },
  {
    question: "What is the main difference between immediate and deferred annuities?",
    answer:
      "An immediate annuity begins making payments within 12 months of purchase — you pay a lump sum and start receiving income right away. A deferred annuity delays payments to a future date, allowing your money to grow tax-deferred during the accumulation phase. Immediate annuities are ideal if you need income now (such as at retirement), while deferred annuities suit people who want to grow their savings before converting to income later.",
  },
  {
    question: "How are annuities given favorable tax treatment?",
    answer:
      "Annuities grow tax-deferred, meaning you do not pay taxes on investment gains until you withdraw the money. This allows your earnings to compound faster than in a taxable account. When you do take withdrawals, only the earnings portion is taxed as ordinary income — your original contributions (in a non-qualified annuity) come out tax-free since you already paid taxes on that money. Qualified annuities (funded with pre-tax dollars like an IRA) are fully taxable upon withdrawal.",
  },
  {
    question: "What happens to an annuity when you die?",
    answer:
      "What happens depends on the type of annuity and the payout option you selected. If you chose a life-only annuity, payments stop at death and no benefit passes to heirs. If you chose a joint-and-survivor annuity, payments continue to your surviving spouse. If you are still in the accumulation phase, most annuities pay the accumulated value to your named beneficiary. Some annuities include death benefit riders that guarantee your beneficiaries receive at least the amount you originally invested.",
  },
  {
    question: "Can annuities be transferred to another person?",
    answer:
      "Yes, in most cases annuities can be transferred to another person through an assignment or ownership change. However, the tax implications vary significantly. Transferring a non-qualified annuity to a non-spouse can trigger immediate taxes on all gains. Spousal transfers and 1035 exchanges (transferring to a new annuity contract) generally avoid immediate tax consequences. Always consult with a financial professional before transferring an annuity to understand the tax impact.",
  },
];

const ANNUITY_TYPES = [
  {
    title: "Fixed Annuities",
    description: "Offer a guaranteed interest rate for a set period, similar to a CD but with tax-deferred growth. Your principal is protected and your returns are predictable. Fixed annuities are the most conservative option, ideal for risk-averse retirees who want stability above all else.",
    best: "Conservative investors, people nearing retirement, those who want guaranteed returns",
  },
  {
    title: "Variable Annuities",
    description: "Allow you to invest your premiums in sub-accounts similar to mutual funds. Your returns fluctuate based on market performance, offering higher growth potential but also greater risk. Many variable annuities include optional riders for guaranteed minimum income or death benefits.",
    best: "Investors comfortable with market risk, those seeking higher growth potential, people with longer time horizons",
  },
  {
    title: "Immediate Annuities",
    description: "You pay a lump sum and begin receiving income payments within 12 months — often within 30 days. The insurance company calculates your payment based on the amount invested, your age, and current interest rates. Once annuitized, the payments are guaranteed for life or for a set period.",
    best: "Retirees who need income now, people who have just received a lump sum (inheritance, 401k rollover)",
  },
  {
    title: "Deferred Annuities",
    description: "Delay income payments to a future date while your money grows tax-deferred. During the accumulation phase, you can make additional contributions. When you are ready, you convert the annuity to income payments. The longer you defer, the larger your eventual payments will be.",
    best: "People still working, those planning for future retirement income, anyone wanting tax-deferred growth",
  },
];

const TESTIMONIALS = [
  {
    quote: "I was terrified of running out of money in retirement. AEG helped me set up an annuity that guarantees income for the rest of my life. That fear is gone now.",
    name: "Patricia W.",
    role: "Retired teacher, Nashville TN",
  },
  {
    quote: "The IRA vs annuity question had me paralyzed for years. AEG's advisors showed me how to use both strategically. My retirement plan has never been stronger.",
    name: "Thomas H.",
    role: "Engineer, Seattle WA",
  },
  {
    quote: "After my husband passed, I had no idea what to do with his 401k. AEG guided me through the annuity options and I now have predictable monthly income I can count on.",
    name: "Maria G.",
    role: "Widow, Miami FL",
  },
];

export default function AnnuitiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(ANNUITY_FAQS)) }}
      />

      <HeroCTA
        headline="Never Outlive Your Savings"
        subheadline="Annuities provide the one thing every retiree needs — guaranteed income that lasts as long as you do. Learn how they work and whether they belong in your retirement plan."
        backgroundImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&q=80"
        secondaryText="Get a Free Quote"
        secondaryHref="/contact"
      />

      {/* The Problem */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                The Biggest Risk in Retirement Is <span className="text-brand-purple">Living Longer Than Your Money</span>
              </h2>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Americans are living longer than ever. A 65-year-old today has a <strong>50% chance of living past 85</strong> and a 25% chance of reaching 95. That means your retirement savings need to last 20 to 30 years — or more.
              </p>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                Social Security replaces only about 40% of your pre-retirement income. Market downturns, inflation, and unexpected healthcare costs can erode your savings faster than you planned. Annuities solve this problem by converting your savings into guaranteed income that cannot run out.
              </p>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                Whether you are 10 years from retirement or already there, understanding annuities gives you a powerful tool for financial security in your later years.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
                alt="Senior couple reviewing their retirement financial plan together"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Annuity Types */}
      <section className="py-16 md:py-20 bg-brand-bg">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Types of Annuities Explained</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Not all annuities are the same. Each type serves a different purpose depending on your timeline, risk tolerance, and income goals.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ANNUITY_TYPES.map((type) => (
              <div key={type.title} className="rounded-xl bg-white p-8 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-1 bg-brand-purple rounded mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{type.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{type.description}</p>
                <p className="text-sm"><span className="font-semibold text-brand-purple">Best for:</span> <span className="text-gray-600">{type.best}</span></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Annuities Work */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How Annuities Work: Two Phases</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="rounded-xl bg-brand-bg p-8 border border-gray-100">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-purple/10 text-brand-purple font-bold text-lg mb-6">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Accumulation Phase</h3>
              <p className="text-gray-600 leading-relaxed">
                You pay premiums into the annuity — either a single lump sum or regular payments over time. During this phase, your money grows tax-deferred. You do not pay taxes on gains until you start withdrawals. This tax advantage allows your money to compound faster than in a standard taxable investment account.
              </p>
            </div>
            <div className="rounded-xl bg-brand-bg p-8 border border-gray-100">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-purple/10 text-brand-purple font-bold text-lg mb-6">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Payout Phase</h3>
              <p className="text-gray-600 leading-relaxed">
                When you are ready, you annuitize the contract and begin receiving regular income payments. You can choose payments for life, for a set period, or for the lives of both you and your spouse. The amount you receive depends on how much you invested, how long your money grew, your age, and current interest rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      <TestimonialBlock testimonials={TESTIMONIALS} />

      {/* Related Content */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Explore Annuity Topics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "What Happens When an Annuity Matures?", href: "/blog/what-happens-when-an-annuity-matures" },
              { title: "Can You Transfer an Annuity?", href: "/blog/can-you-transfer-an-annuity-to-another-person" },
              { title: "What Happens to an Annuity When You Die?", href: "/blog/what-happens-to-an-annuity-when-you-die" },
              { title: "Annuity Loans Explained", href: "/blog/annuity-loans" },
              { title: "Immediate vs Deferred Annuity", href: "/blog/immediate-vs-deferred-annuity" },
              { title: "IRA vs Annuity", href: "/blog/ira-vs-annuity" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="group rounded-lg border border-gray-200 p-6 hover:border-brand-purple/30 hover:shadow-sm transition-all">
                <h3 className="font-semibold text-gray-900 group-hover:text-brand-purple transition-colors">{link.title}</h3>
                <span className="text-sm text-brand-purple mt-2 inline-block">Read more &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FAQSection faqs={ANNUITY_FAQS} />
      <CTABlock
        headline="Ready to Secure Your Retirement Income?"
        description="Get a free annuity consultation with a licensed advisor. We will help you understand your options and find the right annuity for your retirement goals."
      />
    </>
  );
}
