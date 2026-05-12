"use client";

import { Perdin, Kota } from "@/lib/types";
import { formatTanggal, formatRupiah } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import { getUsers } from "@/lib/storage";

interface Props {
  perdin: Perdin;
  kotaList: Kota[];
}

export default function DetailPerdin({ perdin, kotaList }: Props) {
  const kotaAsal = kotaList.find((k) => k.id === perdin.kotaAsalId);
  const kotaTujuan = kotaList.find((k) => k.id === perdin.kotaTujuanId);
  const users = getUsers();
  const pegawai = users.find((u) => u.id === perdin.userId);
  const approver = perdin.approvedBy
    ? users.find((u) => u.id === perdin.approvedBy)
    : null;

  const Row = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="flex gap-4 py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 w-40 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-800 font-medium flex-1">{value}</span>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Status */}
      <div className="flex items-center gap-3">
        <StatusBadge status={perdin.status} />
        <span className="text-xs text-gray-400">
          Diajukan: {formatTanggal(perdin.createdAt)}
        </span>
      </div>

      {/* Data Pegawai */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Data Pegawai
        </p>
        <Row label="Nama" value={pegawai?.name ?? "-"} />
        <Row label="NIP" value={pegawai?.nip ?? "-"} />
        <Row label="Divisi" value={pegawai?.divisi ?? "-"} />
      </div>

      {/* Data Perdin */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Data Perjalanan
        </p>
        <Row label="Maksud / Tujuan" value={perdin.maksudTujuan} />
        <Row label="Kota Asal" value={kotaAsal?.nama ?? "-"} />
        <Row label="Kota Tujuan" value={kotaTujuan?.nama ?? "-"} />
        <Row
          label="Tanggal Berangkat"
          value={formatTanggal(perdin.tanggalBerangkat)}
        />
        <Row
          label="Tanggal Pulang"
          value={formatTanggal(perdin.tanggalPulang)}
        />
        <Row label="Durasi" value={`${perdin.durasi} hari`} />
        <Row label="Jarak" value={`${perdin.jarakKm} km`} />
      </div>

      {/* Kalkulasi Uang Saku */}
      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-3">
          Kalkulasi Uang Saku
        </p>
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Uang Saku / Hari</span>
            <span className="font-medium">
              {perdin.uangSakuPerHariUSD > 0
                ? `USD ${perdin.uangSakuPerHariUSD}`
                : perdin.uangSakuPerHari > 0
                ? formatRupiah(perdin.uangSakuPerHari)
                : "Tidak ada"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Durasi</span>
            <span className="font-medium">{perdin.durasi} hari</span>
          </div>
          <div className="flex justify-between text-sm font-bold border-t border-blue-200 pt-2 mt-2">
            <span className="text-blue-800">Total Uang Saku</span>
            <span className="text-blue-700 text-base">
              {perdin.totalUangSakuUSD > 0
                ? `USD ${perdin.totalUangSakuUSD}`
                : formatRupiah(perdin.totalUangSaku)}
            </span>
          </div>
        </div>
      </div>

      {/* Approval Info */}
      {perdin.status !== "MENUNGGU" && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Informasi Approval
          </p>
          <Row label="Diproses oleh" value={approver?.name ?? "-"} />
          <Row
            label="Tanggal Proses"
            value={perdin.approvedAt ? formatTanggal(perdin.approvedAt) : "-"}
          />
          {perdin.catatanApproval && (
            <Row label="Catatan" value={perdin.catatanApproval} />
          )}
        </div>
      )}
    </div>
  );
}
