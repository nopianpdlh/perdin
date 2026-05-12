"use client";

import { useState } from "react";
import { EyeIcon } from "@phosphor-icons/react";
import { usePerdin, useKota } from "@/lib/hooks";
import { Perdin } from "@/lib/types";
import { formatTanggal, formatRupiah } from "@/lib/utils";
import { getUsers } from "@/lib/storage";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import DetailPerdin from "@/components/DetailPerdin";
import { TableSkeleton } from "@/components/LoadingState";

export default function SemuaPerdinPage() {
  const { perdinList, loading: perdinLoading } = usePerdin();
  const { kotaList, loading: kotaLoading } = useKota();
  const [detail, setDetail] = useState<Perdin | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("SEMUA");
  const [search, setSearch] = useState("");

  if (perdinLoading || kotaLoading) {
    return <TableSkeleton rows={7} cols={10} />;
  }

  const allUsers = getUsers();
  const getUserName = (id: string) =>
    allUsers.find((u) => u.id === id)?.name ?? "-";
  const getKotaNama = (id: string) =>
    kotaList.find((k) => k.id === id)?.nama ?? "-";

  const filtered = perdinList
    .filter((p) =>
      filterStatus === "SEMUA" ? true : p.status === filterStatus
    )
    .filter((p) => {
      if (!search) return true;
      const name = getUserName(p.userId).toLowerCase();
      const tujuan = getKotaNama(p.kotaTujuanId).toLowerCase();
      const maksud = p.maksudTujuan.toLowerCase();
      const q = search.toLowerCase();
      return name.includes(q) || tujuan.includes(q) || maksud.includes(q);
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div>
      <PageHeader
        title="Semua Perjalanan Dinas"
        subtitle="Rekap seluruh pengajuan perjalanan dinas pegawai"
      />

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Cari pegawai, kota, atau tujuan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Cari perjalanan dinas"
          className="input-base w-64"
        />
        <div className="flex gap-2">
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
            </button>
          ))}
        </div>
      </div>

      <div className="table-shell overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
               <tr className="table-head-row">
                <th className="px-4 py-3 text-left font-medium">No</th>
                <th className="px-4 py-3 text-left font-medium">Pegawai</th>
                <th className="px-4 py-3 text-left font-medium">Tujuan</th>
                <th className="px-4 py-3 text-left font-medium">Kota Asal</th>
                <th className="px-4 py-3 text-left font-medium">Kota Tujuan</th>
                <th className="px-4 py-3 text-left font-medium">Berangkat</th>
                <th className="px-4 py-3 text-left font-medium">Durasi</th>
                <th className="px-4 py-3 text-left font-medium">Jarak</th>
                <th className="px-4 py-3 text-left font-medium">Total Uang Saku</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-10 text-center text-gray-400"
                  >
                    Tidak ada data perjalanan dinas.
                  </td>
                </tr>
              ) : (
                filtered.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {getUserName(p.userId)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs">
                      <p className="truncate">{p.maksudTujuan}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {getKotaNama(p.kotaAsalId)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {getKotaNama(p.kotaTujuanId)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatTanggal(p.tanggalBerangkat)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.durasi} hari</td>
                    <td className="px-4 py-3 text-gray-600">{p.jarakKm} km</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">
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
