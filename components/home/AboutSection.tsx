import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="section-py bg-[var(--color-bg-secondary)]">
      <div className="container-hauselio">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div>
            <p className="caption text-[var(--color-accent)] mb-3">Über HAUSELIO</p>
            <h2 className="heading-2 mb-6">
              Ihr Partner für<br className="hidden sm:block" />
              <span className="text-[var(--color-primary)]">moderne Haushaltsgeräte</span>
            </h2>
            <div className="space-y-3 sm:space-y-4 text-[var(--color-text-secondary)] leading-relaxed">
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

          {/* Right: Office photo */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/about-team.jpg"
                alt="HAUSELIO Team"
                width={500}
                height={313}
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-4 left-2 sm:absolute sm:-bottom-6 sm:-left-6 bg-white rounded-xl p-3 sm:p-4 shadow-lg border border-[var(--color-border-light)] animate-fade-in-up">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--color-success)]/10 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-[var(--color-success)]" />
                </div>
                <div>
                  <p className="text-lg font-bold text-[var(--color-text-primary)]">Seit 2020</p>
                  <p className="text-[11px] text-[var(--color-text-muted)]">In Deutschland</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
