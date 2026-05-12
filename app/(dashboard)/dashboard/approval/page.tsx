"use client";

import { useState } from "react";
import { CheckCircleIcon, EyeIcon, XCircleIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useAuth, usePerdin, useKota } from "@/lib/hooks";
import { Perdin } from "@/lib/types";
import { formatTanggal, formatRupiah } from "@/lib/utils";
import { getUsers } from "@/lib/storage";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import DetailPerdin from "@/components/DetailPerdin";
import { TableSkeleton } from "@/components/LoadingState";

export default function ApprovalPage() {
  const { session } = useAuth();
  const { perdinList, loading: perdinLoading, updatePerdin } = usePerdin();
  const { kotaList, loading: kotaLoading } = useKota();

  const [detail, setDetail] = useState<Perdin | null>(null);
  const [approvalTarget, setApprovalTarget] = useState<{
    perdin: Perdin;
    action: "DISETUJUI" | "DITOLAK";
  } | null>(null);
  const [catatan, setCatatan] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("MENUNGGU");

  if (!session) return null;

  const allUsers = getUsers();
  const getUserName = (id: string) =>
    allUsers.find((u) => u.id === id)?.name ?? "-";
  const getKotaNama = (id: string) =>
    kotaList.find((k) => k.id === id)?.nama ?? "-";

  const filtered = perdinList
    .filter((p) =>
      filterStatus === "SEMUA" ? true : p.status === filterStatus
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  function handleApproval() {
    if (!approvalTarget || !session) return;
    const { perdin, action } = approvalTarget;
    updatePerdin({
      ...perdin,
      status: action,
      approvedBy: session.userId,
      approvedAt: new Date().toISOString(),
      catatanApproval: catatan,
    });
    setApprovalTarget(null);
    setCatatan("");
    toast.success(action === "DISETUJUI" ? "Pengajuan berhasil disetujui." : "Pengajuan berhasil ditolak.");
  }

  if (perdinLoading || kotaLoading) {
    return <TableSkeleton rows={7} cols={8} />;
  }

  const menungguCount = perdinList.filter((p) => p.status === "MENUNGGU").length;

  return (
    <div>
      <PageHeader
        title="Approval Perjalanan Dinas"
        subtitle="Proses persetujuan pengajuan perjalanan dinas pegawai"
      />

      {menungguCount > 0 && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="status" aria-live="polite">
          Terdapat <strong>{menungguCount}</strong> pengajuan yang menunggu persetujuan.
        </div>
      )}

      {/* Filter */}
      <div className="mb-4 flex gap-2" role="tablist" aria-label="Filter status approval">
        {["MENUNGGU", "DISETUJUI", "DITOLAK", "SEMUA"].map((s) => (
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

      <div className="table-shell overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
                <tr className="table-head-row">
                <th className="px-4 py-3 text-left font-medium">No</th>
                <th className="px-4 py-3 text-left font-medium">Pegawai</th>
                <th className="px-4 py-3 text-left font-medium">Tujuan</th>
                <th className="px-4 py-3 text-left font-medium">Kota Tujuan</th>
                <th className="px-4 py-3 text-left font-medium">Berangkat</th>
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
                    Tidak ada data pengajuan.
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
                      {getKotaNama(p.kotaTujuanId)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatTanggal(p.tanggalBerangkat)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.durasi} hari</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {p.totalUangSakuUSD > 0
                        ? `USD ${p.totalUangSakuUSD}`
                        : formatRupiah(p.totalUangSaku)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDetail(p)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Detail"
                        >
                          <EyeIcon size={15} />
                        </button>
                        {p.status === "MENUNGGU" && (
                          <>
                            <button
                              onClick={() =>
                                setApprovalTarget({
                                  perdin: p,
                                  action: "DISETUJUI",
                                })
                              }
                              className="text-green-500 hover:text-green-700 transition-colors"
                              title="Setujui"
                            >
                              <CheckCircleIcon size={15} />
                            </button>
                            <button
                              onClick={() =>
                                setApprovalTarget({
                                  perdin: p,
                                  action: "DITOLAK",
                                })
                              }
                              className="text-red-400 hover:text-red-600 transition-colors"
                              title="Tolak"
                            >
                              <XCircleIcon size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {detail && (
        <Modal
          title="Detail Perjalanan Dinas"
          onClose={() => setDetail(null)}
          size="lg"
        >
          <DetailPerdin perdin={detail} kotaList={kotaList} />
          {detail.status === "MENUNGGU" && (
            <div className="flex gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  setDetail(null);
                  setApprovalTarget({ perdin: detail, action: "DISETUJUI" });
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700"
              >
                 <CheckCircleIcon size={16} />
                Setujui
              </button>
              <button
                onClick={() => {
                  setDetail(null);
                  setApprovalTarget({ perdin: detail, action: "DITOLAK" });
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700"
              >
                 <XCircleIcon size={16} />
                Tolak
              </button>
            </div>
          )}
        </Modal>
      )}

      {/* Approval Confirm Modal */}
      {approvalTarget && (
        <Modal
          title={
            approvalTarget.action === "DISETUJUI"
              ? "Konfirmasi Persetujuan"
              : "Konfirmasi Penolakan"
          }
          onClose={() => {
            setApprovalTarget(null);
            setCatatan("");
          }}
          size="md"
        >
          <div className="space-y-4">
            {/* Summary */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Pegawai</span>
                <span className="font-medium">
                  {getUserName(approvalTarget.perdin.userId)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tujuan</span>
                <span className="font-medium">
                  {getKotaNama(approvalTarget.perdin.kotaTujuanId)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Durasi</span>
                <span className="font-medium">
                  {approvalTarget.perdin.durasi} hari
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="text-gray-700 font-semibold">
                  Total Uang Saku
                </span>
                <span className="font-bold text-blue-700 text-base">
                  {approvalTarget.perdin.totalUangSakuUSD > 0
                    ? `USD ${approvalTarget.perdin.totalUangSakuUSD}`
                    : formatRupiah(approvalTarget.perdin.totalUangSaku)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catatan (opsional)
              </label>
              <textarea
                rows={3}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Tambahkan catatan jika diperlukan..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setApprovalTarget(null);
                  setCatatan("");
                }}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleApproval}
                className={`px-5 py-2 text-sm text-white rounded-lg font-medium ${
                  approvalTarget.action === "DISETUJUI"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {approvalTarget.action === "DISETUJUI"
                  ? "Ya, Setujui"
                  : "Ya, Tolak"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
