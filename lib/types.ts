// ============================================================
// TYPES — Perjalanan Dinas (Perdin) App
// ============================================================

export type UserRole = "ADMIN" | "PEGAWAI" | "SDM";

export interface User {
  id: string;
  username: string;
  password: string; // plain text for demo purposes
  name: string;
  role: UserRole;
  nip: string; // Nomor Induk Pegawai
  divisi: string;
}

export interface Kota {
  id: string;
  nama: string;
  latitude: number;
  longitude: number;
  provinsi: string;
  pulau: string;
  luarNegeri: boolean;
}

export type StatusPerdin =
  | "MENUNGGU"
  | "DISETUJUI"
  | "DITOLAK";

export interface Perdin {
  id: string;
  userId: string;       // FK ke User
  maksudTujuan: string;
  tanggalBerangkat: string; // ISO date string YYYY-MM-DD
  tanggalPulang: string;    // ISO date string YYYY-MM-DD
  durasi: number;           // hari, kalkulasi otomatis
  kotaAsalId: string;       // FK ke Kota
  kotaTujuanId: string;     // FK ke Kota
  status: StatusPerdin;
  // Kalkulasi
  jarakKm: number;
  uangSakuPerHari: number;  // IDR, atau 0 jika USD
  uangSakuPerHariUSD: number; // USD, 0 jika IDR
  totalUangSaku: number;    // IDR
  totalUangSakuUSD: number; // USD
  // Approval
  approvedBy?: string;      // userId SDM
  approvedAt?: string;      // ISO datetime
  catatanApproval?: string;
  // Metadata
  createdAt: string;
}

export interface AuthSession {
  userId: string;
  username: string;
  name: string;
  role: UserRole;
}
