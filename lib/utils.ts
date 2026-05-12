// ============================================================
// UTILS — Kalkulasi jarak, uang saku, dan helpers
// ============================================================
import { Kota } from "./types";

/**
 * Haversine formula — menghitung jarak antara dua titik lat/lon dalam km.
 * Referensi: https://en.wikipedia.org/wiki/Haversine_formula
 */
export function hitungJarak(asal: Kota, tujuan: Kota): number {
  const R = 6371; // radius bumi dalam km
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(tujuan.latitude - asal.latitude);
  const dLon = toRad(tujuan.longitude - asal.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(asal.latitude)) *
      Math.cos(toRad(tujuan.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // 1 desimal
}

/**
 * Menghitung uang saku per hari berdasarkan klasifikasi jarak dan kota.
 * Returns { perHariIDR, perHariUSD }
 */
export function hitungUangSaku(
  asal: Kota,
  tujuan: Kota,
  jarakKm: number
): { perHariIDR: number; perHariUSD: number } {
  // Luar negeri → USD 50/hari
  if (tujuan.luarNegeri) {
    return { perHariIDR: 0, perHariUSD: 50 };
  }

  // ≤ 60km → tidak dapat uang saku
  if (jarakKm <= 60) {
    return { perHariIDR: 0, perHariUSD: 0 };
  }

  // > 60km, satu provinsi → Rp 200.000
  if (asal.provinsi === tujuan.provinsi) {
    return { perHariIDR: 200_000, perHariUSD: 0 };
  }

  // > 60km, beda provinsi, satu pulau → Rp 250.000
  if (asal.pulau === tujuan.pulau) {
    return { perHariIDR: 250_000, perHariUSD: 0 };
  }

  // > 60km, beda provinsi, beda pulau → Rp 300.000
  return { perHariIDR: 300_000, perHariUSD: 0 };
}

/**
 * Menghitung durasi perdin dalam hari (inklusif).
 */
export function hitungDurasi(berangkat: string, pulang: string): number {
  const d1 = new Date(berangkat);
  const d2 = new Date(pulang);
  const diffMs = d2.getTime() - d1.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays + 1; // inklusif
}

/**
 * Format angka ke Rupiah.
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format tanggal ke dd/MM/yyyy.
 */
export function formatTanggal(isoDate: string): string {
  if (!isoDate) return "-";
  const d = new Date(isoDate);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Generate simple unique ID.
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/**
 * Klasifikasi uang saku dalam teks.
 */
export function labelKlasifikasi(
  asal: Kota,
  tujuan: Kota,
  jarakKm: number
): string {
  if (tujuan.luarNegeri) return "Luar Negeri (USD 50/hari)";
  if (jarakKm <= 60) return "≤ 60km (Tidak ada uang saku)";
  if (asal.provinsi === tujuan.provinsi)
    return "Dalam Provinsi > 60km (Rp 200.000/hari)";
  if (asal.pulau === tujuan.pulau)
    return "Luar Provinsi, Dalam Pulau (Rp 250.000/hari)";
  return "Luar Provinsi & Luar Pulau (Rp 300.000/hari)";
}
