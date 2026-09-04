import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import NewsletterUnsubscribeForm from "@/components/newsletter/NewsletterUnsubscribeForm";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Newsletter abmelden",
  description: "Melden Sie sich vom HAUSAURA Newsletter ab. Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Abmeldelink.",
  alternates: { canonical: "/newsletter-abmelden" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Newsletter abmelden — HAUSAURA",
    description: "Melden Sie sich vom HAUSAURA Newsletter ab.",
    url: `${SITE_URL}/newsletter-abmelden`,
    siteName: "HAUSAURA",
    locale: "de_DE",
    type: "website",
  },
};

export default function NewsletterAbmeldenPage() {
  return (
    <main id="main-content">
      <div className="container-hausaura py-6 sm:py-8">
        <Breadcrumb items={[{ label: "Newsletter abmelden" }]} />

        <div className="max-w-lg mx-auto">
          <h1 className="heading-1 mb-4">Newsletter abmelden</h1>
          <p className="body-large mb-8">
            Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link, um sich vom Newsletter abzumelden.
          </p>

          <NewsletterUnsubscribeForm />
        </div>
      </div>
    </main>
  );
}
