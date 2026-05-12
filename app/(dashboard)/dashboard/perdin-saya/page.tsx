"use client";

import { useState } from "react";
import Link from "next/link";
import { EyeIcon, PlusIcon } from "@phosphor-icons/react";
import { useAuth, usePerdin, useKota } from "@/lib/hooks";
import { Perdin } from "@/lib/types";
import { formatTanggal, formatRupiah } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import DetailPerdin from "@/components/DetailPerdin";
import { TableSkeleton } from "@/components/LoadingState";

export default function PerdinSayaPage() {
  const { session } = useAuth();
  const { perdinList, loading: perdinLoading } = usePerdin();
  const { kotaList, loading: kotaLoading } = useKota();
  const [detail, setDetail] = useState<Perdin | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("SEMUA");

  if (!session) return null;
  if (perdinLoading || kotaLoading) return <TableSkeleton rows={6} cols={8} />;

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
            className="btn-primary"
          >
            <PlusIcon size={16} />
            Ajukan Perdin
          </Link>
        }
      />

      {/* Filter */}
      <div className="mb-4 flex gap-2" role="tablist" aria-label="Filter status perdin saya">
        {["SEMUA", "MENUNGGU", "DISETUJUI", "DITOLAK"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${
              filterStatus === s
                ? "chip-filter chip-filter-active"
                : "chip-filter chip-filter-idle"
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

      <div className="table-shell overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-head-row">
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
                        className="icon-action"
                        title="Detail"
                        aria-label={`Lihat detail perjalanan ${idx + 1}`}
                      >
                         <EyeIcon size={15} />
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
