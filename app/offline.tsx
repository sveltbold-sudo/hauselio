export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <main id="main-content" className="container-hausaura py-24 text-center max-w-2xl mx-auto">
      <div className="w-20 h-20 bg-[var(--color-bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
        Sie sind offline
      </h1>
      <p className="text-[var(--color-text-secondary)] mb-8">
        Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors"
      >
        Erneut versuchen
      </button>
    </main>
  );
}
