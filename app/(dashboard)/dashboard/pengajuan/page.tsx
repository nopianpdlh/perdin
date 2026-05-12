"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth, useKota, usePerdin } from "@/lib/hooks";
import { Kota } from "@/lib/types";
import {
  hitungJarak,
  hitungUangSaku,
  hitungDurasi,
  generateId,
  formatRupiah,
  labelKlasifikasi,
} from "@/lib/utils";
import PageHeader from "@/components/PageHeader";
import { PageLoadingState } from "@/components/LoadingState";

export default function PengajuanPerdinPage() {
  const { session } = useAuth();
  const { kotaList, loading } = useKota();
  const { addPerdin } = usePerdin();
  const router = useRouter();

  const [form, setForm] = useState({
    maksudTujuan: "",
    tanggalBerangkat: "",
    tanggalPulang: "",
    kotaAsalId: "",
    kotaTujuanId: "",
  });

  const [preview, setPreview] = useState<{
    durasi: number;
    jarakKm: number;
    perHariIDR: number;
    perHariUSD: number;
    totalIDR: number;
    totalUSD: number;
    klasifikasi: string;
    kotaAsal: Kota | null;
    kotaTujuan: Kota | null;
  } | null>(null);

  const [submitted, setSubmitted] = useState(false);

  // Hitung preview secara real-time
  useEffect(() => {
    const { tanggalBerangkat, tanggalPulang, kotaAsalId, kotaTujuanId } = form;
    if (!tanggalBerangkat || !tanggalPulang || !kotaAsalId || !kotaTujuanId) {
      setPreview(null);
      return;
    }
    if (kotaAsalId === kotaTujuanId) {
      setPreview(null);
      return;
    }
    if (new Date(tanggalPulang) < new Date(tanggalBerangkat)) {
      setPreview(null);
      return;
    }

    const asal = kotaList.find((k) => k.id === kotaAsalId);
    const tujuan = kotaList.find((k) => k.id === kotaTujuanId);
    if (!asal || !tujuan) return;

    const durasi = hitungDurasi(tanggalBerangkat, tanggalPulang);
    const jarakKm = hitungJarak(asal, tujuan);
    const { perHariIDR, perHariUSD } = hitungUangSaku(asal, tujuan, jarakKm);

    setPreview({
      durasi,
      jarakKm,
      perHariIDR,
      perHariUSD,
      totalIDR: perHariIDR * durasi,
      totalUSD: perHariUSD * durasi,
      klasifikasi: labelKlasifikasi(asal, tujuan, jarakKm),
      kotaAsal: asal,
      kotaTujuan: tujuan,
    });
  }, [form, kotaList]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session || !preview) {
      toast.error("Lengkapi data pengajuan terlebih dahulu.");
      return;
    }

    const asal = kotaList.find((k) => k.id === form.kotaAsalId)!;
    const tujuan = kotaList.find((k) => k.id === form.kotaTujuanId)!;

    addPerdin({
      id: generateId(),
      userId: session.userId,
      maksudTujuan: form.maksudTujuan,
      tanggalBerangkat: form.tanggalBerangkat,
      tanggalPulang: form.tanggalPulang,
      durasi: preview.durasi,
      kotaAsalId: form.kotaAsalId,
      kotaTujuanId: form.kotaTujuanId,
      status: "MENUNGGU",
      jarakKm: preview.jarakKm,
      uangSakuPerHari: preview.perHariIDR,
      uangSakuPerHariUSD: preview.perHariUSD,
      totalUangSaku: preview.totalIDR,
      totalUangSakuUSD: preview.totalUSD,
      createdAt: new Date().toISOString(),
    });

    setSubmitted(true);
    toast.success("Pengajuan perjalanan dinas berhasil dikirim.");
  }

  if (loading) {
    return <PageLoadingState label="Memuat referensi kota..." />;
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto mt-16 text-center">
        <div className="bg-green-50 rounded-xl p-8 border border-green-200">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            Pengajuan Berhasil Dikirim
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Pengajuan perjalanan dinas Anda telah dikirim dan menunggu
            persetujuan dari bagian SDM.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({
                  maksudTujuan: "",
                  tanggalBerangkat: "",
                  tanggalPulang: "",
                  kotaAsalId: "",
                  kotaTujuanId: "",
                });
                setPreview(null);
              }}
              className="btn-secondary"
            >
              Ajukan Lagi
            </button>
            <button
              onClick={() => router.push("/dashboard/perdin-saya")}
              className="btn-primary"
            >
              Lihat Perdin Saya
            </button>
          </div>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Pengajuan Perjalanan Dinas"
        subtitle="Isi formulir berikut untuk mengajukan perjalanan dinas"
      />

      <div className="surface-card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Maksud Tujuan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maksud / Tujuan Perdin <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={form.maksudTujuan}
              onChange={(e) =>
                setForm({ ...form, maksudTujuan: e.target.value })
              }
              className="input-base w-full resize-none"
              placeholder="Jelaskan tujuan perjalanan dinas..."
            />
          </div>

          {/* Kota Asal & Tujuan */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kota Asal <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.kotaAsalId}
                onChange={(e) =>
                  setForm({ ...form, kotaAsalId: e.target.value })
                }
                className="input-base w-full"
              >
                <option value="">-- Pilih Kota --</option>
                {kotaList.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kota Tujuan <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.kotaTujuanId}
                onChange={(e) =>
                  setForm({ ...form, kotaTujuanId: e.target.value })
                }
                className="input-base w-full"
              >
                <option value="">-- Pilih Kota --</option>
                {kotaList
                  .filter((k) => k.id !== form.kotaAsalId)
                  .map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Tanggal */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Berangkat <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="date"
                min={today}
                value={form.tanggalBerangkat}
                onChange={(e) =>
                  setForm({ ...form, tanggalBerangkat: e.target.value })
                }
                className="input-base w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Pulang <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="date"
                min={form.tanggalBerangkat || today}
                value={form.tanggalPulang}
                onChange={(e) =>
                  setForm({ ...form, tanggalPulang: e.target.value })
                }
                className="input-base w-full"
              />
            </div>
          </div>

          {/* Preview Kalkulasi */}
          {preview && (
            <div className="rounded-lg border border-cyan-200 bg-cyan-50/60 p-4 space-y-2" role="status" aria-live="polite">
              <p className="text-sm font-semibold text-blue-800 mb-3">
                Ringkasan Kalkulasi
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                <span className="text-gray-600">Durasi</span>
                <span className="font-medium text-gray-800">
                  {preview.durasi} hari
                </span>

                <span className="text-gray-600">Jarak</span>
                <span className="font-medium text-gray-800">
                  {preview.jarakKm} km
                </span>

                <span className="text-gray-600">Klasifikasi</span>
                <span className="font-medium text-gray-800">
                  {preview.klasifikasi}
                </span>

                <span className="text-gray-600">Uang Saku/Hari</span>
                <span className="font-medium text-gray-800">
                  {preview.perHariUSD > 0
                    ? `USD ${preview.perHariUSD}`
                    : preview.perHariIDR > 0
                    ? formatRupiah(preview.perHariIDR)
                    : "Tidak ada"}
                </span>

                <span className="text-gray-600 font-semibold">Total Uang Saku</span>
                <span className="font-bold text-blue-700 text-base">
                  {preview.totalUSD > 0
                    ? `USD ${preview.totalUSD}`
                    : preview.totalIDR > 0
                    ? formatRupiah(preview.totalIDR)
                    : "Rp 0"}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!preview}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Kirim Pengajuan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
