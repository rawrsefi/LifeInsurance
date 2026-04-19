import type { Metadata } from "next";
import ApplyWizard from "@/components/apply/ApplyWizard";

export const metadata: Metadata = {
  title: "Apply Now — Life Insurance Application",
  description:
    "Complete your Assurity Enterprise Group life insurance application securely. Sensitive data is encrypted in your browser before transmission.",
};

export default function ApplyPage() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10">
          <p className="text-sm font-semibold text-brand-purple uppercase tracking-wider mb-2">Application</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Apply for coverage</h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl">
            Complete all sections. Your submission is encrypted in the browser before it is sent. A PDF summary is generated for our team after secure decryption on our servers.
          </p>
        </div>
        <ApplyWizard />
      </div>
    </section>
  );
}
