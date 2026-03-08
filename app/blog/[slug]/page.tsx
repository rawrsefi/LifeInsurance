import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllSlugs } from "@/lib/mdx";
import { generateArticleSchema, generateFAQSchema, SITE_URL } from "@/lib/seo";
import FAQSection from "@/components/FAQSection";
import CTABlock from "@/components/CTABlock";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `${SITE_URL}/blog/${slug}`,
      images: post.image ? [{ url: post.image, alt: post.imageAlt }] : [],
    },
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    options: { parseFrontmatter: false },
  });

  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.description,
    url: `${SITE_URL}/blog/${slug}`,
    datePublished: post.date,
    image: post.image,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {post.faq.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(post.faq)) }} />
      )}

      <article className="py-12 md:py-20 bg-white">
        <div className="mx-auto max-w-3xl px-6">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-brand-gray">
            <Link href="/" className="hover:text-brand-purple">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-brand-purple">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{post.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">{post.title}</h1>
            <p className="mt-4 text-lg text-gray-600">{post.description}</p>
            <div className="mt-6 flex items-center gap-4 text-sm text-brand-gray">
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
              <span>&middot;</span>
              <span>{post.readingTime}</span>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg prose-gray max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-a:text-brand-purple prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-img:rounded-xl">
            {content}
          </div>
        </div>
      </article>

      {post.faq.length > 0 && <FAQSection faqs={post.faq} />}
      <CTABlock />
    </>
  );
}
