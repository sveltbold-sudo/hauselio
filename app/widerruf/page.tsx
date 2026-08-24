import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Widerrufsbelehrung",
  description: "Ihr Widerrufsrecht bei Einkäufen im HAUSELIO Online-Shop.",
  robots: { index: false, follow: false },
};

export default function WiderrufPage() {
  return (
    <div className="container-hauselio py-16 max-w-3xl">
      <Breadcrumb items={[{ label: "Widerruf" }]} />
      <h1 className="heading-1 mb-8">Widerrufsbelehrung</h1>

      <div className="prose-hauselio space-y-8">
        <section>
          <h2 className="heading-3 mb-3">Widerrufsrecht</h2>
          <p className="text-[var(--color-text-secondary)]">
            Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu
            widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen
            benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat.
          </p>
          <p className="text-[var(--color-text-secondary)] mt-3">
            Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
          </p>
          <div className="bg-[var(--color-bg)] rounded-xl p-6 my-4 space-y-2">
            <p className="text-[var(--color-text-secondary)]">HAUSELIO GmbH</p>
            <p className="text-[var(--color-text-secondary)]">Kastanienallee 42</p>
            <p className="text-[var(--color-text-secondary)]">10435 Berlin</p>
            <p className="text-[var(--color-text-secondary)]">E-Mail: widerruf@hauselio.de</p>
            <p className="text-[var(--color-text-secondary)]">Telefon: +49 (0)30 555 789 01</p>
          </div>
          <p className="text-[var(--color-text-secondary)]">
            mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief, Telefax oder
            E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das
            beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
          </p>
          <p className="text-[var(--color-text-secondary)] mt-3">
            Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des
            Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">Folgen des Widerrufs</h2>
          <p className="text-[var(--color-text-secondary)]">
            Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten
            haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus
            ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste
            Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem
            Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns
            eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der
            ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas
            anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
          </p>
          <p className="text-[var(--color-text-secondary)] mt-3">
            Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder bis
            Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches
            der frühere Zeitpunkt ist.
          </p>
          <p className="text-[var(--color-text-secondary)] mt-3">
            Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem
            Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns oder an
          </p>
          <div className="bg-[var(--color-bg)] rounded-xl p-6 my-4">
            <p className="text-[var(--color-text-secondary)]">HAUSELIO GmbH</p>
            <p className="text-[var(--color-text-secondary)]">Kastanienallee 42</p>
            <p className="text-[var(--color-text-secondary)]">10435 Berlin</p>
          </div>
          <p className="text-[var(--color-text-secondary)]">
            zurückzusenden oder zu übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der
            Frist von vierzehn Tagen absenden.
          </p>
          <p className="text-[var(--color-text-secondary)] mt-3">
            Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.
          </p>
          <p className="text-[var(--color-text-secondary)] mt-3">
            Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf
            einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht
            notwendigen Umgang mit ihnen zurückzuführen ist.
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">Ausschluss bzw. vorzeitiges Erlöschen des Widerrufsrechts</h2>
          <p className="text-[var(--color-text-secondary)]">
            Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung versiegelter Waren, die aus
            Gründen des Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe geeignet sind, wenn ihre
            Versiegelung nach der Lieferung entfernt wurde.
          </p>
        </section>

        <section>
          <h2 className="heading-3 mb-3">Muster-Widerrufsformular</h2>
          <div className="bg-[var(--color-bg)] rounded-xl p-6 border-2 border-dashed border-[var(--color-border)]">
            <p className="text-[var(--color-text-secondary)] mb-4">
              (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und
              senden Sie es zurück.)
            </p>
            <div className="space-y-4 text-[var(--color-text-secondary)]">
              <p>An: HAUSELIO GmbH, Kastanienallee 42, 10435 Berlin, E-Mail: widerruf@hauselio.de</p>
              <p>Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf
                der folgenden Waren (*) / die Erbringung der folgenden Dienstleistung (*):</p>
              <p>Bestellt am (*) / erhalten am (*):</p>
              <p>Name des/der Verbraucher(s):</p>
              <p>Anschrift des/der Verbraucher(s):</p>
              <p>Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):</p>
              <p>Datum:</p>
              <p className="text-xs italic">(*) Unzutreffendes streichen.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
