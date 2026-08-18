import Link from "next/link";
import { ArrowRight, BookOpen, ChefHat, Lightbulb } from "lucide-react";

const editorialContent = [
  {
    type: "Guide",
    icon: BookOpen,
    title: "Der ultimative Kaffee-Ratgeber",
    excerpt: "Von der Bohne bis zur Tasse – alles was Sie über die Zubereitung des perfekten Kaffees wissen müssen.",
    href: "/shop?category=kaffee",
    readTime: "8 Min.",
    category: "Kaffeevollautomaten",
    gradient: "from-amber-600 to-amber-800",
  },
  {
    type: "Rezept",
    icon: ChefHat,
    title: "Perfektes Brot backen mit der Küchenmaschine",
    excerpt: "Frisches Brot zum Frühstück – mit unseren Schritt-für-Schritt-Anleitungen gelingt es immer.",
    href: "/shop?category=kueche",
    readTime: "5 Min.",
    category: "Küchenmaschinen",
    gradient: "from-rose-600 to-rose-800",
  },
  {
    type: "Guide",
    icon: Lightbulb,
    title: "Sparsam kochen: Energie sparen in der Küche",
    excerpt: "Mit den richtigen Geräten und Tipps können Sie bis zu 30% Energie beim Kochen sparen.",
    href: "/shop?category=kueche",
    readTime: "6 Min.",
    category: "Tipps & Tricks",
    gradient: "from-emerald-600 to-emerald-800",
  },
];

export default function EditorialContentSection() {
  return (
    <section className="section-py bg-white">
      <div className="container-hauselio">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="caption text-[var(--color-accent)] mb-3">Magazin</p>
          <h2 className="heading-2">Ratgeber, Rezepte & mehr</h2>
          <p className="body-large mt-2">
            Entdecken Sie unsere Tipps für mehr Genuss und Komfort
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {editorialContent.map((content, i) => {
            const Icon = content.icon;
            return (
              <Link
                key={i}
                href={content.href}
                className="group bg-white rounded-2xl overflow-hidden border border-[var(--color-border-light)] hover:border-[var(--color-primary)]/20 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Image area with gradient overlay */}
                <div className={`aspect-[16/10] bg-gradient-to-br ${content.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-full text-[10px] font-bold text-[var(--color-text-primary)]">
                    <Icon className="w-3 h-3" />
                    {content.type}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-sm text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                    {content.title}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mb-3 line-clamp-2 leading-relaxed">
                    {content.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-[var(--color-text-muted)]">
                      {content.readTime} Lesezeit
                    </span>
                    <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider">
                      {content.category}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
