"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import Button from "@/components/ui/Button";

function EmailVerificationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "no-token">("loading");
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [resendStatus, setResendStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    if (!token) {
      setStatus("no-token");
      return;
    }

    async function verifyEmail() {
      setStatus("loading");
      try {
        const res = await fetch("/api/customer/verify-email/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (res.ok) {
          setStatus("success");
        } else {
          const data = await res.json();
          setError(data.error || "Verifizierung fehlgeschlagen");
          setStatus("error");
        }
      } catch {
        setError("Ein Fehler ist aufgetreten");
        setStatus("error");
      }
    }

    verifyEmail();
  }, [token, retryCount]);

  const handleResend = async () => {
    setResendStatus("loading");
    try {
      const res = await fetch("/api/customer/verify-email", { method: "POST" });
      if (res.ok) {
        setResendStatus("success");
      } else {
        setResendStatus("error");
      }
    } catch {
      setResendStatus("error");
    }
  };

  return (
    <main id="main-content" className="container-hausaura py-20 min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 text-[var(--color-primary)] animate-spin mx-auto mb-4" />
            <h1 className="heading-2 mb-2">E-Mail wird verifiziert…</h1>
            <p className="text-[var(--color-text-muted)]">Bitte warten Sie einen Moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-[var(--color-success)] mx-auto mb-4" />
            <h1 className="heading-2 mb-2">E-Mail verifiziert!</h1>
            <p className="text-[var(--color-text-muted)] mb-6">
              Ihre E-Mail-Adresse wurde erfolgreich verifiziert. Sie können jetzt alle Funktionen nutzen.
            </p>
            <Link href="/konto">
              <Button size="lg" className="w-full">
                Zu meinem Konto
              </Button>
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-[var(--color-danger)] mx-auto mb-4" />
            <h1 className="heading-2 mb-2">Verifizierung fehlgeschlagen</h1>
            <p className="text-[var(--color-text-muted)] mb-6">{error}</p>
            <div className="flex flex-col gap-3">
              <Button size="lg" className="w-full" onClick={() => setRetryCount((c) => c + 1)}>
                Erneut versuchen
              </Button>
              {resendStatus === "success" ? (
                <p className="text-sm text-[var(--color-success)]" role="status">Ein neuer Verifizierungslink wurde gesendet.</p>
              ) : (
                <Button size="lg" variant="outline" className="w-full" onClick={handleResend} disabled={resendStatus === "loading"}>
                  {resendStatus === "loading" ? <><Loader2 className="w-4 h-4 animate-spin" /> Wird gesendet…</> : "Neuen Verifizierungslink senden"}
                </Button>
              )}
              <Link href="/konto">
                <Button size="lg" variant="outline" className="w-full">
                  Zurück zum Konto
                </Button>
              </Link>
            </div>
          </>
        )}

        {status === "no-token" && (
          <>
            <Mail className="w-16 h-16 text-[var(--color-primary)] mx-auto mb-4" />
            <h1 className="heading-2 mb-2">E-Mail-Verifizierung</h1>
            <p className="text-[var(--color-text-muted)] mb-6">
              Bitte öffnen Sie den Link in der Verifizierungs-E-Mail, die wir Ihnen zugesendet haben.
            </p>
            <div className="flex flex-col gap-3">
              {resendStatus === "success" ? (
                <p className="text-sm text-[var(--color-success)]" role="status">Ein neuer Verifizierungslink wurde gesendet.</p>
              ) : (
                <Button size="lg" className="w-full" onClick={handleResend} disabled={resendStatus === "loading"}>
                  {resendStatus === "loading" ? <><Loader2 className="w-4 h-4 animate-spin" /> Wird gesendet…</> : "Neuen Verifizierungslink senden"}
                </Button>
              )}
              <Link href="/konto">
                <Button size="lg" variant="outline" className="w-full">
                  Zurück zum Konto
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function EmailVerificationFallback() {
  return (
    <main id="main-content" className="container-hausaura py-20 min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <Loader2 className="w-12 h-12 text-[var(--color-primary)] animate-spin mx-auto mb-4" />
        <h1 className="heading-2 mb-2">E-Mail wird verifiziert…</h1>
        <p className="text-[var(--color-text-muted)]">Bitte warten Sie einen Moment.</p>
      </div>
    </main>
  );
}

export default function EmailVerificationPage() {
  return (
    <Suspense fallback={<EmailVerificationFallback />}>
      <EmailVerificationContent />
    </Suspense>
  );
}
