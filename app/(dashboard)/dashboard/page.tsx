"use client";

import { useEffect, useState } from "react";
import {
  ArrowClockwiseIcon,
  CheckSquareIcon,
  ClockCountdownIcon,
  FileTextIcon,
  TrendUpIcon,
  UsersThreeIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { useAuth } from "@/lib/hooks";
import { getPerdinList, getUsers } from "@/lib/storage";
import { Perdin } from "@/lib/types";
import { formatTanggal, formatRupiah } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import { TableSkeleton } from "@/components/LoadingState";

interface StatCard {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  tone: "primary" | "cool" | "calm" | "ink";
  note: string;
}

const TONE_STYLE: Record<StatCard["tone"], { rail: string; panel: string; icon: string }> = {
  primary: {
    rail: "before:bg-cyan-600",
    panel: "bg-cyan-50 border-cyan-100",
    icon: "text-cyan-700",
  },
  cool: {
    rail: "before:bg-cyan-500",
    panel: "bg-cyan-50/60 border-cyan-100",
    icon: "text-cyan-700",
  },
  calm: {
    rail: "before:bg-sky-500",
    panel: "bg-sky-50 border-sky-100",
    icon: "text-sky-700",
  },
  ink: {
    rail: "before:bg-slate-500",
    panel: "bg-slate-100/70 border-slate-200",
    icon: "text-slate-700",
  },
};

export default function DashboardPage() {
  const { session } = useAuth();
  const [perdinList, setPerdinList] = useState<Perdin[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  function hydrateDashboard() {
    try {
      setLoadError(null);
      const all = getPerdinList();
      setPerdinList(all);
      setUserCount(getUsers().length);
    } catch {
      setLoadError("Data dashboard tidak dapat dimuat. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    hydrateDashboard();
  }, []);

  if (!session) return null;

  // Filter berdasarkan role
  const myPerdin =
    session.role === "PEGAWAI"
      ? perdinList.filter((p) => p.userId === session.userId)
      : perdinList;

  const menunggu = myPerdin.filter((p) => p.status === "MENUNGGU").length;
  const disetujui = myPerdin.filter((p) => p.status === "DISETUJUI").length;
  const ditolak = myPerdin.filter((p) => p.status === "DITOLAK").length;

  const stats: StatCard[] = [
    {
      label: session.role === "PEGAWAI" ? "Perdin Saya" : "Total Perdin",
      value: myPerdin.length,
      icon: <FileTextIcon size={22} />,
      tone: "primary",
      note: "Volume dokumen aktif",
    },
    {
      label: "Menunggu Approval",
      value: menunggu,
      icon: <ClockCountdownIcon size={22} />,
      tone: "cool",
      note: "Perlu tindak lanjut",
    },
    {
      label: "Disetujui",
      value: disetujui,
      icon: <CheckSquareIcon size={22} />,
      tone: "calm",
      note: "Siap dieksekusi",
    },
    ...(session.role === "ADMIN"
      ? [
          {
            label: "Total User",
            value: userCount,
            icon: <UsersThreeIcon size={22} />,
            tone: "ink" as const,
            note: "Akun terdaftar",
          },
        ]
      : [
          {
            label: "Ditolak",
            value: ditolak,
            icon: <XCircleIcon size={22} />,
            tone: "ink" as const,
            note: "Butuh revisi pengajuan",
          },
        ]),
  ];

  // 5 perdin terbaru
  const recent = [...myPerdin]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const allUsers = getUsers();
  const getUserName = (id: string) =>
    allUsers.find((u) => u.id === id)?.name ?? "-";

  if (loading) {
    return <TableSkeleton rows={6} cols={4} />;
  }

  if (loadError) {
    return (
      <div className="surface-card p-8 max-w-xl">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Dashboard belum siap</h2>
        <p className="text-sm text-slate-600 mb-6">{loadError}</p>
        <button
          onClick={() => {
            setLoading(true);
            hydrateDashboard();
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-700 text-white px-4 py-2 text-sm hover:bg-cyan-800"
        >
          <ArrowClockwiseIcon size={16} />
          Muat Ulang Data
        </button>
      </div>
    );
  }

  const approvalRate = myPerdin.length > 0 ? Math.round((disetujui / myPerdin.length) * 100) : 0;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Dashboard Operasional</h1>
          <p className="text-sm text-slate-600 mt-1">
          Selamat datang, {session.name}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-800">
          <TrendUpIcon size={14} />
          Tingkat persetujuan: {approvalRate}%
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md before:absolute before:inset-y-0 before:left-0 before:w-1 ${TONE_STYLE[s.tone].panel} ${TONE_STYLE[s.tone].rail}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-3xl font-semibold text-slate-900 leading-none">{s.value}</p>
                <p className="text-sm font-medium text-slate-700 mt-2">{s.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.note}</p>
              </div>
              <div className={`rounded-xl border border-white/70 bg-white/80 p-2.5 ${TONE_STYLE[s.tone].icon}`}>
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Perdin */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-700 text-sm">
            Perdin Terbaru
          </h2>
        </div>
        {recent.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-gray-400">
            Belum ada data perjalanan dinas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <th className="px-6 py-3 text-left font-medium">Pegawai</th>
                  <th className="px-6 py-3 text-left font-medium">Tujuan</th>
                  <th className="px-6 py-3 text-left font-medium">Tanggal</th>
                  <th className="px-6 py-3 text-left font-medium">Durasi</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-800">
                      {getUserName(p.userId)}
                    </td>
                    <td className="px-6 py-3 text-gray-600 max-w-xs truncate">
                      {p.maksudTujuan}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {formatTanggal(p.tanggalBerangkat)}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {p.durasi} hari
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
