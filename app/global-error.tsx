"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen bg-slate-100 p-6 flex items-center justify-center">
        <div className="surface-card max-w-xl w-full p-8 text-center">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Aplikasi mengalami gangguan</h2>
          <p className="text-sm text-slate-600 mb-6">{error.message || "Silakan muat ulang aplikasi."}</p>
          <button onClick={reset} className="px-4 py-2 rounded-lg bg-cyan-700 text-white hover:bg-cyan-800">
            Muat Ulang
          </button>
        </div>
      </body>
    </html>
  );
}
