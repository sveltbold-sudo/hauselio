import Link from "next/link";
import { ArrowRight, BookOpen, ChefHat, Lightbulb, Calendar } from "lucide-react";

const editorialContent = [
  {
    type: "Guide",
    icon: BookOpen,
    title: "Der ultimative Kaffee-Ratgeber",
    excerpt: "Von der Bohne bis zur Tasse – alles was Sie über die Zubereitung des perfekten Kaffees wissen müssen.",
    href: "/shop?category=kaffee",
    readTime: "8 Min. Lesezeit",
    category: "Kaffeevollautomaten",
    color: "bg-amber-500",
  },
  {
    type: "Rezept",
    icon: ChefHat,
    title: "Perfektes Brot backen mit der Küchenmaschine",
    excerpt: "Frisches Brot zum Frühstück – mit unseren Schritt-für-Schritt-Anleitungen gelingt es immer.",
    href: "/shop?category=kueche",
    readTime: "5 Min. Lesezeit",
    category: "Küchenmaschinen",
    color: "bg-rose-500",
  },
  {
    type: "Guide",
    icon: Lightbulb,
    title: "Sparsam kochen: Energie sparen in der Küche",
    excerpt: "Mit den richtigen Geräten und Tipps können Sie bis zu 30% Energie beim Kochen sparen.",
    href: "/shop?category=kueche",
    readTime: "6 Min. Lesezeit",
    category: "Tipps & Tricks",
    color: "bg-green-500",
  },
];

const upcomingEvents = [
  {
    date: "15. Feb",
    title: "Live Kochdemo",
    description: "Küchenmaschinen live erleben",
    location: "HAUSELIO Showroom Berlin",
  },
  {
    date: "22. Feb",
    title: "Kaffeeworkshop",
    description: "Barista-Geheimnisse kennenlernen",
    location: "Online via Zoom",
  },
];

export default function EditorialContentSection() {
  return (
    <section className="section-py bg-white">
      <div className="container-hauselio">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="caption text-[var(--color-primary)] mb-3">Magazin</p>
          <h2 className="heading-2">Ratgeber, Rezepte & mehr</h2>
          <p className="body-large mt-2">
            Entdecken Sie unsere Tipps für mehr Genuss und Komfort in Ihrem Zuhause
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editorial Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            {editorialContent.map((content, i) => {
              const Icon = content.icon;
              return (
                <Link
                  key={i}
                  href={content.href}
                  className="group bg-[var(--color-bg)] rounded-2xl overflow-hidden border border-[var(--color-border-light)] hover:border-[var(--color-primary)]/30 hover:shadow-lg transition-all duration-500 animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Image Placeholder */}
                  <div className={`aspect-[16/10] ${content.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-[var(--color-text-primary)]">
                      <Icon className="w-3 h-3" />
                      {content.type}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                      {content.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] mb-3 line-clamp-2">
                      {content.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[var(--color-text-muted)]">
                        {content.readTime}
                      </span>
                      <span className="text-xs font-bold text-[var(--color-primary)]">
                        {content.category}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Events Sidebar */}
          <div className="space-y-6">
            <div className="bg-[var(--color-primary-50)] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                <h3 className="font-bold text-[var(--color-text-primary)]">
                  Nächste Events
                </h3>
              </div>

              <div className="space-y-4">
                {upcomingEvents.map((event, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-4 border border-[var(--color-border-light)]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-[var(--color-primary)] rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs text-center leading-tight">
                          {event.date}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[var(--color-text-primary)]">
                          {event.title}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                          {event.description}
                        </p>
                        <p className="text-xs text-[var(--color-primary)] mt-1 font-medium">
                          {event.location}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-2">
                Newsletter abonnieren
              </h3>
              <p className="text-sm text-white/80 mb-4">
                Erhalten Sie exklusive Tipps, Angebote und Rezepte direkt in Ihr Postfach.
              </p>
              <a
                href="/newsletter"
                className="inline-block w-full text-center px-4 py-2.5 bg-white text-[var(--color-primary)] rounded-xl font-semibold text-sm hover:bg-white/90 transition-colors"
              >
                Jetzt anmelden
              </a>
            </div>

            {/* All Articles Link */}
            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 w-full py-3 border-2 border-[var(--color-border)] rounded-xl text-sm font-semibold text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all"
            >
              Alle Produkte ansehen
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
