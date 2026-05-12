import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="surface-card max-w-lg w-full p-8 text-center">
        <p className="text-sm uppercase tracking-wide text-cyan-700 font-semibold mb-2">404</p>
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Halaman tidak ditemukan</h1>
        <p className="text-sm text-slate-600 mb-6">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-cyan-700 text-white hover:bg-cyan-800 inline-flex">
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
