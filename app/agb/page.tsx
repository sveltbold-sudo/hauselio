import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Allgemeine Geschäftsbedingungen",
  description: "AGB der HAUSELIO GmbH. Geschäftsbedingungen für den Online-Shop.",
  robots: { index: false, follow: false },
};

export default function AGBPage() {
  return (
    <main id="main-content" className="container-hauselio py-16 max-w-3xl">
      <Breadcrumb items={[{ label: "AGB" }]} />
      <h1 className="heading-1 mb-8">Allgemeine Geschäftsbedingungen</h1>

      <div className="prose-hauselio space-y-8">
        <section>
          <h2 className="heading-3 mb-3">§ 1 Geltungsbereich</h2>
          <p className="text-[var(--color-text-secondary)]">
            (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend &quot;AGB&quot;) der HAUSELIO GmbH (nachfolgend
            &quot;Verkäufer&quot;) gelten für alle Verträge, die ein Verbraucher oder Unternehmer (nachfolgend
            &quot;Kunde&quot;) mit dem Verkäufer bezüglich der vom Verkäufer in seinem Online-Shop dargestellten
            Produkte abschließt. Die Einbeziehung von eigenen Bedingungen des Kunden wird hiermit
            widersprochen, es sei denn, es wird vereinbart, dass ihre Geltung vorliegt.
          </p>
          <p className="text-[var(--color-text-secondary)] mt-3">
            (2) Verbraucher im Sinne dieser AGB ist jede natürliche Person, die ein Rechtsgeschäft zu
            Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen
            beruflichen Tätigkeit zugerechnet werden können. Unternehmer im Sinne dieser AGB ist eine
            natürliche oder juristische Person oder eine rechtsfähige Personengesellschaft, die bei
            Abschluss eines Rechtsgeschäfts in Ausübung ihrer gewerblichen oder selbständigen beruflichen
            Tätigkeit handelt.
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">§ 2 Zustandekommen des Vertrages</h2>
          <p className="text-[var(--color-text-secondary)]">
            (1) Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot des
            Verkäufers dar, sondern dient dazu, dem Kunden ein unverbindliches Angebot abzugeben.
          </p>
          <p className="text-[var(--color-text-secondary)] mt-3">
            (2) Der Kunde kann das Angebot über das in den Online-Shop integrierte elektronische
            Bestellsystem abgeben. Dabei legt der Kunde die ausgewählten Produkte in den Warenkorb und
            durchläuft die folgenden Schritte:
          </p>
          <ul className="list-disc list-inside text-[var(--color-text-secondary)] mt-2 space-y-1">
            <li>Eingabe der Rechnungs- und Lieferadresse</li>
            <li>Auswahl der Zahlungsart</li>
            <li>Überprüfung der Bestelldaten</li>
            <li>Versand der Bestellung durch Betätigen des Buttons &quot;Bestellung verbindlich bestellen&quot;</li>
          </ul>
          <p className="text-[var(--color-text-secondary)] mt-3">
            (3) Der Verkäufer kann die Annahme des Angebots innerhalb von fünf Tagen nach Eingang der
            Bestellung erklären, indem er dem Kunden eine Bestätigungs-E-Mail zusendet, in der der
            Eingang der Bestellung bestätigt wird (Bestellbestätigung).
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">§ 3 Preise und Zahlungsbedingungen</h2>
          <p className="text-[var(--color-text-secondary)]">
            (1) Die in den Produktbeschreibungen dargestellten Preise sind Endpreise und enthalten die
            gesetzliche Mehrwertsteuer. Zusätzlich fallen eventuell Lieferkosten an, die auf der
            jeweiligen Produktseite im &quot;Warenkorb&quot; vor Abschluss des Bestellvorgangs mitgeteilt werden.
          </p>
          <p className="text-[var(--color-text-secondary)] mt-3">
            (2) Die Zahlung erfolgt ausschließlich per SEPA-Überweisung. Die Zahlungsfrist beträgt 5
            Werktage nach Abschluss des Vertrages.
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">§ 4 Lieferung</h2>
          <p className="text-[var(--color-text-secondary)]">
            (1) Die Lieferung erfolgt innerhalb Deutschlands an die vom Kunden angegebene Lieferadresse,
            sofern nichts anderes vereinbart wurde.
          </p>
          <p className="text-[var(--color-text-secondary)] mt-3">
            (2) Die Lieferzeit beträgt innerhalb Deutschlands in der Regel 2-5 Werktage nach
            Vertragsschluss, sofern in der Produktbeschreibung keine abweichende Lieferzeit angegeben ist.
          </p>
          <p className="text-[var(--color-text-secondary)] mt-3">
            (3) Der Versand erfolgt über DHL oder einen anderen zuverlässigen Versanddienstleister.
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">§ 5 Widerrufsrecht</h2>
          <p className="text-[var(--color-text-secondary)]">
            (1) Verbraucher haben ein vierzehntägiges Widerrufsrecht.
          </p>
          <p className="text-[var(--color-text-secondary)] mt-3">
            (2) Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung versiegelter Waren, die aus
            Gründen des Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe geeignet sind, wenn ihre
            Versiegelung nach der Lieferung entfernt wurde.
          </p>
          <p className="text-[var(--color-text-secondary)] mt-3">
            (3) Im Einzelnen regelt sich das Widerrufsrecht nach den Bestimmungen im Widerrufsbogen.
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">§ 6 Gewährleistung</h2>
          <p className="text-[var(--color-text-secondary)]">
            (1) Das gesetzliche Mängelhaftungsrecht gilt.
          </p>
          <p className="text-[var(--color-text-secondary)] mt-3">
            (2) Abweichend davon gilt: Bei gebrauchten Waren ist die Gewährleistung ausgeschlossen, sofern
            der Mangel bei Gefahrübergang nicht arglistig verschwiegen oder ein Garantiefall vorliegt.
          </p>
          <p className="text-[var(--color-text-secondary)] mt-3">
            (3) Der Kunde wird gebeten, beim Vorliegen eines Mangels den Verkäufer umgehend zu
            kontaktieren und dabei das bestellte Produkt sowie eine Beschreibung des Mangels
            mitzuteilen. Bei Versäumung dieser Anzeigepflicht bleibt der gesetzliche Gewährleistungsanspruch
            unberührt.
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">§ 7 Salvatorische Klausel</h2>
          <p className="text-[var(--color-text-secondary)]">
            Sollten einzelne Bestimmungen dieses Vertrages unwirksam sein oder werden, so bleibt die
            Wirksamkeit des Vertrages im Übrigen hiervon unberührt. Anstelle der unwirksamen Bestimmung
            gilt eine wirksame Regelung als vereinbart, die dem wirtschaftlichen Zweck der unwirksamen
            Bestimmung am nächsten kommt. Gleiches gilt für etwaige Regelungslücken.
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">§ 8 Gerichtsstand</h2>
          <p className="text-[var(--color-text-secondary)]">
            Es gilt deutsches Recht. Erfüllungsort sowie ausschließlicher Gerichtsstand ist Berlin, sofern
            der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches
            Sondervermögen ist.
          </p>
        </section>
      </div>
    </main>
  );
}
