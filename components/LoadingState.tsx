"use client";

import { CircleNotchIcon } from "@phosphor-icons/react";

export function PageLoadingState({ label = "Memuat data..." }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="surface-card p-8 flex flex-col items-center justify-center gap-3 min-h-56">
      <CircleNotchIcon className="animate-spin text-cyan-700" size={22} />
      <p className="text-sm text-slate-600">{label}</p>
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div role="status" aria-live="polite" className="surface-card overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
      </div>
      <div className="p-4 space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {Array.from({ length: cols }).map((__, colIndex) => (
              <div key={colIndex} className="h-3.5 bg-slate-200 rounded animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
