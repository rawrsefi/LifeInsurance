import type { Metadata } from "next";
import ApplyWizard from "@/components/apply/ApplyWizard";

export const metadata: Metadata = {
  title: "Apply Now — Life Insurance Application",
  description:
    "Complete your Assurity Enterprise Group life insurance application securely. Sensitive data is encrypted in your browser before transmission.",
};

export default function ApplyPage() {
  return (
    <section className="min-h-[70vh] bg-gradient-to-b from-gray-50 via-white to-gray-50/80 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 md:mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-purple">Application</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Apply for coverage</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-600">
            Complete all sections. Your data is encrypted in the browser before it is sent. Our team receives a PDF after secure decryption on our servers.
          </p>
        </div>
        <ApplyWizard />
      </div>
    </section>
  );
}
