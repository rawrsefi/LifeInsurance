"use client";

import { useState, FormEvent } from "react";

const COVERAGE_TYPES = [
  "Term Life Insurance",
  "Whole Life Insurance",
  "Universal Life Insurance",
  "No-Exam Life Insurance",
  "Annuities",
  "Other / Not Sure",
];

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      coverageType: (form.elements.namedItem("coverageType") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send. Please try again.");
      setStatus("success");
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl bg-green-50 border border-green-200 p-8 text-center">
        <div className="text-4xl mb-3">&#10003;</div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Thank You!</h3>
        <p className="text-green-700">Your information has been received. One of our insurance advisors will contact you within 24 hours.</p>
        <button onClick={() => setStatus("idle")} className="mt-4 text-sm text-brand-purple font-medium hover:underline">Submit another request</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
          <input type="text" id="name" name="name" required className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition" placeholder="John Smith" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
          <input type="email" id="email" name="email" required className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition" placeholder="john@example.com" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
          <input type="tel" id="phone" name="phone" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition" placeholder="(555) 123-4567" />
        </div>
        <div>
          <label htmlFor="coverageType" className="block text-sm font-medium text-gray-700 mb-1.5">Coverage Type *</label>
          <select id="coverageType" name="coverageType" required className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition bg-white">
            <option value="">Select coverage type</option>
            {COVERAGE_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">Tell us about your needs</label>
        <textarea id="message" name="message" rows={4} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 outline-none transition resize-none" placeholder="What coverage are you looking for? Any specific concerns?" />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{errorMsg}</p>
      )}

      <button type="submit" disabled={status === "loading"} className="w-full rounded-lg bg-brand-purple px-8 py-4 text-base font-semibold text-white hover:bg-brand-purple-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
        {status === "loading" ? "Sending..." : "Get Your Free Quote"}
      </button>
      <p className="text-xs text-gray-500 text-center">Your information is secure and will never be shared with third parties.</p>
    </form>
  );
}
