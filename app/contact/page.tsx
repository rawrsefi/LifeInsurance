import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import FAQSection from "@/components/FAQSection";
import { generateFAQSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Get a Free Life Insurance Quote",
  description:
    "Request your free, no-obligation life insurance or annuity quote from Assurity Enterprise Group. Our licensed advisors respond within 24 hours.",
};

const CONTACT_FAQS = [
  {
    question: "How long does it take to receive my quote?",
    answer:
      "You will receive a preliminary quote within 24 hours of submitting your information. For more complex coverage needs, our advisors may schedule a brief phone call to ensure they recommend the best option for your specific situation.",
  },
  {
    question: "Is there any obligation when I request a quote?",
    answer:
      "Absolutely not. Your quote is 100% free with zero obligation. We believe in earning your business through education and transparency, never pressure. You are free to take our recommendations to any other provider for comparison.",
  },
  {
    question: "What information do I need to get a quote?",
    answer:
      "To provide an accurate quote, we need your basic contact information, the type of coverage you are interested in, and any specific concerns or goals you have. You do not need medical records, financial statements, or any documentation to get started.",
  },
  {
    question: "Will my information be shared with third parties?",
    answer:
      "Your privacy is paramount. We never sell, share, or distribute your personal information to third parties for marketing purposes. Your data is used solely to provide you with insurance quotes and recommendations from our team.",
  },
];

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(CONTACT_FAQS)) }}
      />

      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Info */}
            <div>
              <p className="text-sm font-semibold text-brand-purple uppercase tracking-wider mb-3">Free Quote</p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Your Family&apos;s Protection Starts with a Conversation
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Tell us about your needs and a licensed insurance advisor will contact you within 24 hours with personalized recommendations. No pressure. No obligation. Just honest guidance.
              </p>

              <div className="mt-10 space-y-6">
                {[
                  { title: "Fast Response", description: "Our team responds within 24 hours, typically same-day during business hours." },
                  { title: "Licensed Advisors", description: "Every person you speak with is a licensed insurance professional, not a call center agent." },
                  { title: "Zero Pressure", description: "We educate and recommend. The decision is always 100% yours." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-purple/10 flex items-center justify-center shrink-0">
                      <svg className="h-5 w-5 text-brand-purple" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div className="rounded-2xl bg-brand-bg border border-gray-200 p-8 md:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Your Free Quote</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <FAQSection faqs={CONTACT_FAQS} />
    </>
  );
}
