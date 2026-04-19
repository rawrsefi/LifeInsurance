import type { BlogPost } from "@/lib/mdx";
import { resolveReviewer } from "@/lib/editorial";

export function BlogPostByline({ post }: { post: BlogPost }) {
  const { name, credential } = resolveReviewer(post);
  return (
    <p className="mt-4 text-sm text-gray-600 border-l-4 border-brand-purple/30 pl-4">
      <span className="font-medium text-gray-800">Reviewed by {name}.</span> {credential}.
    </p>
  );
}

export function BlogYMYLDisclaimer() {
  return (
    <aside className="mt-12 rounded-xl border border-gray-200 bg-gray-50/80 p-6 text-sm text-gray-600 leading-relaxed">
      <p className="font-semibold text-gray-800 mb-2">Editorial &amp; disclosure</p>
      <p>
        Articles on this site are for general education only. They are not legal, tax, or personalized insurance
        advice. Products, rates, and availability vary by carrier, health, and state. Always confirm details with a
        licensed insurance professional before buying or replacing coverage.
      </p>
    </aside>
  );
}
