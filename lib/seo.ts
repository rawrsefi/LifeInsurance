import { getOrgSameAsList } from "@/lib/editorial";

export const SITE_URL = "https://www.aeginsurance.com";
export const SITE_NAME = "AEG - Assurity Enterprise Group";
export const SITE_DESCRIPTION =
  "Protect your family's future with trusted life insurance and annuity solutions from Assurity Enterprise Group. Get your free quote today.";

export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateArticleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  image,
  reviewedBy,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  /** When set, adds a Person alongside the org as author for EEAT signals. */
  reviewedBy?: { name: string; credential?: string };
}) {
  const orgAuthor = {
    "@type": "Organization" as const,
    name: SITE_NAME,
    url: SITE_URL,
  };
  const authors: object[] = [orgAuthor];
  if (reviewedBy?.name) {
    authors.push({
      "@type": "Person",
      name: reviewedBy.name,
      ...(reviewedBy.credential ? { jobTitle: reviewedBy.credential } : {}),
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    image: image || `${SITE_URL}/images/aeg-logo.png`,
    author: authors.length === 1 ? orgAuthor : authors,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/aeg-logo.png` },
    },
  };
}

export function generateOrgSchema() {
  const sameAs = getOrgSameAsList();
  return {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/aeg-logo.png`,
    description: SITE_DESCRIPTION,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "English",
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}
