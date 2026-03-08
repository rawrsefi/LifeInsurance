import type { Metadata } from "next";
import BlogCard from "@/components/BlogCard";
import { getAllPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Life Insurance & Annuity Blog",
  description:
    "Expert guides, tips, and educational articles about life insurance, annuities, and financial protection for your family. Written by licensed insurance professionals.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-brand-purple uppercase tracking-wider mb-3">Resources</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Insurance Insights & Guides</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Plain-language guides to help you make informed decisions about life insurance and annuities. No jargon, no sales pitches — just the information you need.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Articles coming soon. Check back shortly.</p>
          </div>
        )}
      </div>
    </section>
  );
}
