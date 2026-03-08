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
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    image: image || `${SITE_URL}/images/aeg-logo.png`,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/aeg-logo.png` },
    },
  };
}

export function generateOrgSchema() {
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
    sameAs: [],
  };
}
