"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="surface-card max-w-lg w-full p-8 text-center">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Terjadi kendala pada halaman dashboard</h2>
        <p className="text-sm text-slate-600 mb-6">
          {error.message || "Terjadi kesalahan tidak terduga. Silakan coba lagi."}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-cyan-700 text-white hover:bg-cyan-800"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
