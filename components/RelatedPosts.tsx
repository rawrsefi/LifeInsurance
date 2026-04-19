import Link from "next/link";
import type { BlogPost } from "@/lib/mdx";

export default function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="mt-16 pt-12 border-t border-gray-200" aria-labelledby="related-posts-heading">
      <h2 id="related-posts-heading" className="text-xl font-bold text-gray-900 mb-6">
        Related articles
      </h2>
      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="group block">
              <span className="font-semibold text-brand-purple group-hover:underline">{p.title}</span>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
