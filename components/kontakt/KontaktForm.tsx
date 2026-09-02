"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface SiteSettings {
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
}

export default function KontaktForm({ settings }: { settings: SiteSettings }) {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Fehler beim Senden");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  const addressLines = settings.contactAddress.split(",").map((s) => s.trim());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Contact Form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-5 sm:p-8">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[var(--color-success-light)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-8 h-8 text-[var(--color-success)]" />
              </div>
              <h2 className="heading-2 mb-3">Nachricht gesendet!</h2>
              <p className="body-large">
                Vielen Dank für Ihre Nachricht. Wir melden uns bei Ihnen.
              </p>
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    subject: "",
                    message: "",
                  });
                }}
                variant="outline"
                className="mt-6"
              >
                Neue Nachricht
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} aria-label="Kontaktformular">
              <fieldset>
                <legend className="heading-3 mb-6">
                  Nachricht senden
                </legend>

              {error && (
                <div id="form-error" role="alert" className="bg-[var(--color-danger)]/5 border border-[var(--color-danger)]/20 rounded-xl p-4 text-sm text-[var(--color-danger)] mb-6">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Vorname *"
                  name="firstName"
                  required
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                <Input
                  label="Nachname *"
                  name="lastName"
                  required
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <Input
                  label="E-Mail *"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <Input
                  label="Betreff *"
                  name="subject"
                  required
                  autoComplete="off"
                  value={formData.subject}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                  Nachricht *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-colors duration-300 resize-y placeholder:text-[var(--color-text-muted)]"
                  placeholder="Wie können wir Ihnen helfen?"
                />
              </div>
              <Button type="submit" size="lg" isLoading={isLoading} aria-describedby={error ? "form-error" : undefined}>
                <Send className="w-4 h-4 mr-2" />
                Nachricht senden
              </Button>
              </fieldset>
            </form>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-6">
        <address className="space-y-6 not-italic">
        {/* Contact details */}
        <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-6">
          <h2 className="font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[var(--color-primary)]" />
            Kontaktinformationen
          </h2>
          <div className="space-y-4">
            <a
              href={`mailto:${settings.contactEmail}`}
              className="flex items-center gap-3 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors group"
            >
               <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-50)] flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-[var(--color-primary)] group-hover:text-white" />
              </div>
              <span className="font-medium">{settings.contactEmail}</span>
            </a>
            <a
              href={`tel:${settings.contactPhone.replace(/\s/g, "")}`}
              className="flex items-center gap-3 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors group"
            >
               <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-50)] flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-[var(--color-primary)] group-hover:text-white" />
              </div>
              <span className="font-medium">{settings.contactPhone}</span>
            </a>
            <div className="flex items-start gap-3 text-[var(--color-text-secondary)]">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-50)] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
              </div>
              <span className="font-medium">
                HAUSAURA GmbH
                <br />
                {addressLines.map((line, i) => (
                  <span key={i}>{line}{i < addressLines.length - 1 ? <br /> : ""}</span>
                ))}
              </span>
            </div>
          </div>
        </div>

        {/* Hours */}
        <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-6">
          <h2 className="font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--color-primary)]" />
            Öffnungszeiten
          </h2>
          <div className="text-sm text-[var(--color-text-secondary)] space-y-2">
            <p>Montag - Freitag: 9:00 - 18:00 Uhr</p>
            <p>Samstag: 10:00 - 14:00 Uhr</p>
            <p>Sonntag: Geschlossen</p>
          </div>
        </div>
        </address>
      </div>
    </div>
  );
}
