import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  keywords: string[];
  image: string;
  imageAlt: string;
  readingTime: string;
  faq: { question: string; answer: string }[];
  content: string;
  /** Optional; falls back to site editorial defaults for EEAT. */
  reviewedBy?: string;
  reviewedByCredential?: string;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  return files
    .map((file) => getPostBySlug(file.replace(".mdx", "")))
    .filter(Boolean)
    .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime()) as BlogPost[];
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  const stats = readingTime(content);
  const cleaned = content.replace(/^\s*#\s+.+\n+/, "");
  return {
    slug,
    title: data.title || "",
    description: data.description || "",
    date: data.date || new Date().toISOString(),
    keywords: data.keywords || [],
    image: data.image || "",
    imageAlt: data.imageAlt || "",
    readingTime: stats.text,
    faq: data.faq || [],
    content: cleaned,
    reviewedBy: typeof data.reviewedBy === "string" ? data.reviewedBy : undefined,
    reviewedByCredential: typeof data.reviewedByCredential === "string" ? data.reviewedByCredential : undefined,
  };
}

function keywordJaccard(a: string[], b: string[]): number {
  const norm = (s: string) => s.toLowerCase().trim();
  const A = new Set(a.map(norm));
  const B = new Set(b.map(norm));
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  const union = A.size + B.size - inter;
  return union === 0 ? 0 : inter / union;
}

/** Related posts by keyword overlap; falls back to most recent if ties are weak. */
export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const all = getAllPosts().filter((p) => p.slug !== slug);
  const current = getPostBySlug(slug);
  if (!current || all.length === 0) return [];

  const scored = all.map((p) => ({
    post: p,
    score: keywordJaccard(current.keywords, p.keywords),
  }));
  scored.sort((a, b) => b.score - a.score || +new Date(b.post.date) - +new Date(a.post.date));

  if (scored[0].score === 0) {
    return all.slice(0, limit);
  }
  return scored.slice(0, limit).map((s) => s.post);
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
}
