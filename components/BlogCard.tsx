import Link from "next/link";
import Image from "next/image";

interface BlogCardProps {
  slug: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  readingTime: string;
  date: string;
}

export default function BlogCard({ slug, title, description, image, imageAlt, readingTime, date }: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="group block rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow">
      {image && (
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <Image src={image} alt={imageAlt || title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-3 text-xs text-brand-gray mb-3">
          <time dateTime={date}>{new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
          <span>&middot;</span>
          <span>{readingTime}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-purple transition-colors leading-snug mb-2">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{description}</p>
      </div>
    </Link>
  );
}
