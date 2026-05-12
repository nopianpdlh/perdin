import { StatusPerdin } from "@/lib/types";

const CONFIG: Record<
  StatusPerdin,
  { label: string; className: string }
> = {
  MENUNGGU: {
    label: "Menunggu",
    className: "bg-amber-100 text-amber-800",
  },
  DISETUJUI: {
    label: "Disetujui",
    className: "bg-cyan-100 text-cyan-800",
  },
  DITOLAK: {
    label: "Ditolak",
    className: "bg-red-100 text-red-800",
  },
};

export default function StatusBadge({ status }: { status: StatusPerdin }) {
  const { label, className } = CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
