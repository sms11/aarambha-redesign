'use client';

export default function PublicError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <span className="text-6xl mb-6">😟</span>
      <h2 className="text-2xl font-display font-bold text-[var(--navy)] mb-3">
        Something went wrong
      </h2>
      <p className="text-[var(--muted)] mb-8 max-w-md">
        We're having trouble loading this page. Please try again.
      </p>
      <button
        onClick={reset}
        className="btn-cta px-8 py-3"
      >
        Try Again
      </button>
    </div>
  );
}
