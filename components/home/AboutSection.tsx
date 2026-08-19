import Link from "next/link";
import { ArrowRight, Award, Users, Clock, Shield } from "lucide-react";

const stats = [
  { icon: Users, value: "50.000+", label: "Zufriedene Kunden" },
  { icon: Award, value: "200+", label: "Premium Produkte" },
  { icon: Clock, value: "24h", label: "Schnelle Bearbeitung" },
  { icon: Shield, value: "5 J.", label: "Garantie Optional" },
];

export default function AboutSection() {
  return (
    <section className="section-py bg-[var(--color-bg-secondary)]">
      <div className="container-hauselio">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div>
            <p className="caption text-[var(--color-accent)] mb-3">Über HAUSELIO</p>
            <h2 className="heading-2 mb-6">
              Ihr Partner für<br />
              <span className="text-[var(--color-primary)]">moderne Haushaltsgeräte</span>
            </h2>
            <div className="space-y-4 text-[var(--color-text-secondary)] leading-relaxed">
              <p>
                HAUSELIO steht für hochwertige Haushaltsgeräte zu fairen Preisen.
                Wir bieten Ihnen eine kuratierte Auswahl an Premium-Geräten von
                führenden Marken wie Miele, Bosch, Siemens und Dyson.
              </p>
              <p>
                Mit Sitz in Berlin sind wir Ihr deutscher Ansprechpartner für
                alles rund um den modernen Haushalt. Unser Team beraten Sie
                persönlich und sorgt für eine reibungslose Abwicklung.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/ueber-uns"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors shadow-lg shadow-blue-500/20"
              >
                Mehr über uns
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold rounded-xl hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              >
                Kontakt aufnehmen
              </Link>
            </div>
          </div>

          {/* Right: Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-[var(--color-primary-50)] rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[var(--color-primary)]" />
                  </div>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {stat.value}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
