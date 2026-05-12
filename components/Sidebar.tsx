"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardTextIcon,
  FileTextIcon,
  MapPinIcon,
  SignOutIcon,
  SquaresFourIcon,
  CheckSquareIcon,
  UsersThreeIcon,
  XIcon,
} from "@phosphor-icons/react";
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
    icon: <SquaresFourIcon />,
    roles: ["ADMIN", "PEGAWAI", "SDM"],
  },
  {
    href: "/dashboard/pengajuan",
    label: "Pengajuan Perdin",
    icon: <FileTextIcon />,
    roles: ["PEGAWAI"],
  },
  {
    href: "/dashboard/perdin-saya",
    label: "Perdin Saya",
    icon: <ClipboardTextIcon />,
    roles: ["PEGAWAI"],
  },
  {
    href: "/dashboard/approval",
    label: "Approval Perdin",
    icon: <CheckSquareIcon />,
    roles: ["SDM"],
  },
  {
    href: "/dashboard/semua-perdin",
    label: "Semua Perdin",
    icon: <ClipboardTextIcon />,
    roles: ["ADMIN", "SDM"],
  },
  {
    href: "/dashboard/master-kota",
    label: "Master Kota",
    icon: <MapPinIcon />,
    roles: ["ADMIN"],
  },
  {
    href: "/dashboard/master-user",
    label: "Master User",
    icon: <UsersThreeIcon />,
    roles: ["ADMIN"],
  },
];

interface SidebarProps {
  session: AuthSession;
  onLogout: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({
  session,
  onLogout,
  mobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(session.role)
  );

  return (
    <>
      <div
        onClick={onCloseMobile}
        className={`fixed inset-0 z-30 bg-slate-900/30 lg:hidden transition-opacity ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 h-dvh w-72 bg-cyan-950 text-white flex flex-col overflow-y-auto transition-transform lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
      {/* Logo / Brand */}
      <div className="px-6 py-5 border-b border-cyan-900 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold tracking-wide">PERDIN</h1>
          <p className="text-xs text-cyan-300 mt-0.5">Sistem Perjalanan Dinas</p>
        </div>
        <button
          onClick={onCloseMobile}
          className="lg:hidden text-cyan-200 hover:text-white"
          aria-label="Tutup menu"
        >
          <XIcon />
        </button>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-cyan-900">
        <p className="text-sm font-semibold truncate">{session.name}</p>
        <span className="inline-block mt-1 text-xs bg-cyan-800 text-cyan-100 px-2 py-0.5 rounded-full">
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
                  ? "bg-cyan-800 text-white font-medium"
                  : "text-cyan-200 hover:bg-cyan-900 hover:text-white"
               }`}
                onClick={onCloseMobile}
              >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-cyan-900">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-cyan-200 hover:bg-cyan-900 hover:text-white transition-colors"
        >
          <SignOutIcon />
          Keluar
        </button>
      </div>
      </aside>
    </>
  );
}
