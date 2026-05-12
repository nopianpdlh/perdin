"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  FileText,
  ClipboardList,
  CheckSquare,
  Users,
  LogOut,
} from "lucide-react";
import { AuthSession } from "@/lib/types";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    roles: ["ADMIN", "PEGAWAI", "SDM"],
  },
  {
    href: "/dashboard/pengajuan",
    label: "Pengajuan Perdin",
    icon: <FileText size={18} />,
    roles: ["PEGAWAI"],
  },
  {
    href: "/dashboard/perdin-saya",
    label: "Perdin Saya",
    icon: <ClipboardList size={18} />,
    roles: ["PEGAWAI"],
  },
  {
    href: "/dashboard/approval",
    label: "Approval Perdin",
    icon: <CheckSquare size={18} />,
    roles: ["SDM"],
  },
  {
    href: "/dashboard/semua-perdin",
    label: "Semua Perdin",
    icon: <ClipboardList size={18} />,
    roles: ["ADMIN", "SDM"],
  },
  {
    href: "/dashboard/master-kota",
    label: "Master Kota",
    icon: <MapPin size={18} />,
    roles: ["ADMIN"],
  },
  {
    href: "/dashboard/master-user",
    label: "Master User",
    icon: <Users size={18} />,
    roles: ["ADMIN"],
  },
];

interface SidebarProps {
  session: AuthSession;
  onLogout: () => void;
}

export default function Sidebar({ session, onLogout }: SidebarProps) {
  const pathname = usePathname();

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(session.role)
  );

  return (
    <aside className="w-64 min-h-screen bg-blue-900 text-white flex flex-col">
      {/* Logo / Brand */}
      <div className="px-6 py-5 border-b border-blue-800">
        <h1 className="text-lg font-bold tracking-wide">PERDIN</h1>
        <p className="text-xs text-blue-300 mt-0.5">Sistem Perjalanan Dinas</p>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-blue-800">
        <p className="text-sm font-semibold truncate">{session.name}</p>
        <span className="inline-block mt-1 text-xs bg-blue-700 text-blue-100 px-2 py-0.5 rounded-full">
          {session.role}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {visibleItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-blue-700 text-white font-medium"
                  : "text-blue-200 hover:bg-blue-800 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-blue-800">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-blue-200 hover:bg-blue-800 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </aside>
  );
}
