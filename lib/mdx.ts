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
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
}
