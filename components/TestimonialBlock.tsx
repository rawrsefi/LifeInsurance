interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

interface TestimonialBlockProps {
  testimonials: Testimonial[];
  title?: string;
}

export default function TestimonialBlock({ testimonials, title = "What Our Clients Say" }: TestimonialBlockProps) {
  return (
    <section className="py-16 md:py-20 bg-brand-bg">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-xl bg-white p-8 shadow-sm border border-gray-100">
              <div className="text-brand-purple text-3xl mb-4">&ldquo;</div>
              <p className="text-gray-700 leading-relaxed mb-6">{t.quote}</p>
              <div className="border-t border-gray-100 pt-4">
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                <p className="text-xs text-brand-gray">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
