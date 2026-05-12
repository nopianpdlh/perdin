"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Eye } from "lucide-react";
import { useAuth, usePerdin, useKota } from "@/lib/hooks";
import { Perdin } from "@/lib/types";
import { formatTanggal, formatRupiah } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import DetailPerdin from "@/components/DetailPerdin";

export default function PerdinSayaPage() {
  const { session } = useAuth();
  const { perdinList } = usePerdin();
  const { kotaList } = useKota();
  const [detail, setDetail] = useState<Perdin | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("SEMUA");

  if (!session) return null;

  const myPerdin = perdinList
    .filter((p) => p.userId === session.userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const filtered =
    filterStatus === "SEMUA"
      ? myPerdin
      : myPerdin.filter((p) => p.status === filterStatus);

  const getKotaNama = (id: string) =>
    kotaList.find((k) => k.id === id)?.nama ?? "-";

  return (
    <div>
      <PageHeader
        title="Perdin Saya"
        subtitle="Riwayat pengajuan perjalanan dinas Anda"
        action={
          <Link
            href="/dashboard/pengajuan"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Ajukan Perdin
          </Link>
        }
      />

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {["SEMUA", "MENUNGGU", "DISETUJUI", "DITOLAK"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${
              filterStatus === s
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {s === "SEMUA" ? "Semua" : s.charAt(0) + s.slice(1).toLowerCase()}
            {s !== "SEMUA" && (
              <span className="ml-1">
                ({myPerdin.filter((p) => p.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="px-4 py-3 text-left font-medium">No</th>
                <th className="px-4 py-3 text-left font-medium">Tujuan</th>
                <th className="px-4 py-3 text-left font-medium">Kota Tujuan</th>
                <th className="px-4 py-3 text-left font-medium">Berangkat</th>
                <th className="px-4 py-3 text-left font-medium">Pulang</th>
                <th className="px-4 py-3 text-left font-medium">Durasi</th>
                <th className="px-4 py-3 text-left font-medium">Total Uang Saku</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-10 text-center text-gray-400"
                  >
                    Belum ada pengajuan perjalanan dinas.
                  </td>
                </tr>
              ) : (
                filtered.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-3 text-gray-800 max-w-xs">
                      <p className="truncate">{p.maksudTujuan}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {getKotaNama(p.kotaTujuanId)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatTanggal(p.tanggalBerangkat)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatTanggal(p.tanggalPulang)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.durasi} hari</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {p.totalUangSakuUSD > 0
                        ? `USD ${p.totalUangSakuUSD}`
                        : formatRupiah(p.totalUangSaku)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setDetail(p)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        title="Detail"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <Modal
          title="Detail Perjalanan Dinas"
          onClose={() => setDetail(null)}
          size="lg"
        >
          <DetailPerdin perdin={detail} kotaList={kotaList} />
        </Modal>
      )}
    </div>
  );
}
