import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Informationen zum Schutz Ihrer Daten bei der HAUSELIO GmbH.",
  robots: { index: false, follow: false },
};

export default function DatenschutzPage() {
  return (
    <main className="container-hauselio py-16 max-w-3xl">
      <Breadcrumb items={[{ label: "Datenschutz" }]} />
      <h1 className="heading-1 mb-8">Datenschutzerklärung</h1>

      <div className="prose-hauselio space-y-8">
        <section>
          <h2 className="heading-3 mb-3">1. Datenschutz auf einen Blick</h2>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Allgemeine Hinweise</h3>
          <p className="text-[var(--color-text-secondary)]">
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen
            Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen
            Sie persönlich identifiziert werden können.
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">2. Verantwortliche Stelle</h2>
          <div className="bg-[var(--color-bg)] rounded-xl p-6 space-y-2">
            <p className="text-[var(--color-text-secondary)]">HAUSELIO GmbH</p>
            <p className="text-[var(--color-text-secondary)]">Kastanienallee 42</p>
            <p className="text-[var(--color-text-secondary)]">10435 Berlin</p>
            <p className="text-[var(--color-text-secondary)]">Telefon: +49 (0)30 555 789 01</p>
            <p className="text-[var(--color-text-secondary)]">E-Mail: datenschutz@hauselio.de</p>
          </div>
        </section>

        <section>
          <h2 className="heading-3 mb-3">3. Datenerfassung auf dieser Website</h2>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Server-Log-Dateien</h3>
          <p className="text-[var(--color-text-secondary)]">
            Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten
            Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind: Browsertyp und
            Browserversion, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners,
            Uhrzeit der Serveranfrage, IP-Adresse. Eine Zusammenführung dieser Daten mit anderen Datenquellen
            wird nicht vorgenommen.
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">4. Cookies</h2>
          <p className="text-[var(--color-text-secondary)]">
            Die Internetseiten nutzen teilweise so genannte Cookies. Cookies richten auf Ihrem Rechner keinen
            Schaden an und enthalten keine Viren. Cookies dienen dazu, unser Angebot nutzerfreundlicher,
            effektiver und sicherer zu machen. Cookies sind kleine Textdateien, die auf Ihrem Rechner abgelegt
            werden und die Ihr Browser speichert.
          </p>
          <p className="text-[var(--color-text-secondary)] mt-3">
            Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und
            Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell
            ausschließen sowie das automatische Löschen der Cookies beim Schließen des Browsers aktivieren.
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">5. Kontaktformular</h2>
          <p className="text-[var(--color-text-secondary)]">
            Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem
            Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der
            Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht
            ohne Ihre Einwilligung weiter.
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">6. Bestellvorgang</h2>
          <p className="text-[var(--color-text-secondary)]">
            Beim Bestellvorgang werden Ihre Daten zur Abwicklung des Kaufvertrags erhoben und verarbeitet.
            Dies umfasst insbesondere:
          </p>
          <ul className="list-disc list-outside pl-5 text-[var(--color-text-secondary)] mt-2 space-y-1">
            <li>Name, Vorname</li>
            <li>E-Mail-Adresse</li>
            <li>Lieferadresse</li>
            <li>Rechnungsadresse (soweit abweichend)</li>
            <li>Telefonnummer (optional)</li>
            <li>Bestelldaten (Artikel, Menge, Preis)</li>
          </ul>
          <p className="text-[var(--color-text-secondary)] mt-3">
            Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">7. Zahlungsabwicklung</h2>
          <p className="text-[var(--color-text-secondary)]">
            Wir bieten ausschließlich die Zahlungsart SEPA-Überweisung an. Bei dieser Zahlungsart erfolgt die
            Zahlungsabwicklung über unseren Zahlungsdienstleister. Ihre Zahlungsdaten werden ausschließlich
            zur Durchführung der Überweisung verwendet und nicht von uns gespeichert.
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">8. Newsletter</h2>
          <p className="text-[var(--color-text-secondary)]">
            Wenn Sie den auf der Website angebotenen Newsletter beziehen wollen, benötigen wir von Ihnen eine
            E-Mail-Adresse sowie Informationen, die uns die Überprüfung gestatten, dass Sie der Inhaber der
            angegebenen E-Mail-Adresse sind und mit dem Empfang des Newsletters einverstanden sind. Diese
            Daten werden nur für den Versand des Newsletters erhoben und nicht an Dritte weitergegeben.
          </p>
          <p className="text-[var(--color-text-secondary)] mt-3">
            Sie können Ihre Einwilligung zum Empfang des Newsletters jederzeit über den Abbestell-Link in
            jeder E-Mail widerrufen.
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">9. Ihre Rechte</h2>
          <p className="text-[var(--color-text-secondary)]">
            Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer
            gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung
            oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt
            haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Hierzu sowie zu weiteren
            Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden.
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">10. Beschwerderecht</h2>
          <p className="text-[var(--color-text-secondary)]">
            Im Falle einer Verletzung des Datenschutzes können Sie sich bei der zuständigen
            Aufsichtsbehörde beschweren. Die zuständige Aufsichtsbehörde für datenschutzrechtliche Fragen
            ist der Berliner Beauftragte für Datenschutz und Informationsfreiheit, Friedrichstraße 219, 10969 Berlin.
          </p>
        </section>
      </div>
    </main>
  );
}
