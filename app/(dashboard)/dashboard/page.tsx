"use client";

import { useEffect, useState } from "react";
import { FileText, CheckSquare, Clock, Users } from "lucide-react";
import { useAuth } from "@/lib/hooks";
import { getPerdinList, getUsers } from "@/lib/storage";
import { Perdin } from "@/lib/types";
import { formatTanggal, formatRupiah } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";

interface StatCard {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

export default function DashboardPage() {
  const { session } = useAuth();
  const [perdinList, setPerdinList] = useState<Perdin[]>([]);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const all = getPerdinList();
    setPerdinList(all);
    setUserCount(getUsers().length);
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
      icon: <FileText size={22} />,
      color: "bg-blue-500",
    },
    {
      label: "Menunggu Approval",
      value: menunggu,
      icon: <Clock size={22} />,
      color: "bg-yellow-500",
    },
    {
      label: "Disetujui",
      value: disetujui,
      icon: <CheckSquare size={22} />,
      color: "bg-green-500",
    },
    ...(session.role === "ADMIN"
      ? [
          {
            label: "Total User",
            value: userCount,
            icon: <Users size={22} />,
            color: "bg-purple-500",
          },
        ]
      : [
          {
            label: "Ditolak",
            value: ditolak,
            icon: <FileText size={22} />,
            color: "bg-red-500",
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Selamat datang, {session.name}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4"
          >
            <div
              className={`${s.color} text-white rounded-lg p-3 flex-shrink-0`}
            >
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
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
