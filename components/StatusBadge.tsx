import { StatusPerdin } from "@/lib/types";

const CONFIG: Record<
  StatusPerdin,
  { label: string; className: string }
> = {
  MENUNGGU: {
    label: "Menunggu",
    className: "bg-yellow-100 text-yellow-800",
  },
  DISETUJUI: {
    label: "Disetujui",
    className: "bg-green-100 text-green-800",
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
      className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${className}`}
    >
      {label}
    </span>
  );
}
