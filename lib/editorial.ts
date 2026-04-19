import type { BlogPost } from "@/lib/mdx";

/** Site-wide editorial defaults for YMYL disclosures (overridable via env). */
export function getDefaultReviewer() {
  return {
    name: process.env.NEXT_PUBLIC_DEFAULT_REVIEWER_NAME?.trim() || "AEG Editorial Team",
    credential:
      process.env.NEXT_PUBLIC_DEFAULT_REVIEWER_CREDENTIAL?.trim() ||
      "Content reviewed for accuracy by licensed insurance professionals",
  };
}

/** Comma-separated profile URLs for Organization sameAs (e.g. LinkedIn, BBB). */
export function getOrgSameAsList(): string[] {
  const raw = process.env.NEXT_PUBLIC_ORG_SAME_AS?.trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.startsWith("http"));
}

/** Per-post optional `reviewedBy` / `reviewedByCredential` in frontmatter, else site defaults. */
export function resolveReviewer(post: BlogPost) {
  const defaults = getDefaultReviewer();
  return {
    name: (post.reviewedBy?.trim() || defaults.name) as string,
    credential: (post.reviewedByCredential?.trim() || defaults.credential) as string,
  };
}
