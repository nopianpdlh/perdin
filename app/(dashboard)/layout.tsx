"use client";

import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ListIcon } from "@phosphor-icons/react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/lib/hooks";
import { initStorage } from "@/lib/storage";
import { PageLoadingState } from "@/components/LoadingState";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, loading, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    initStorage();
  }, []);

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/login");
    }
  }, [loading, session, router]);

  if (loading || !session) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-md">
          <PageLoadingState label="Menyiapkan dashboard operasional..." />
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        session={session}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur border-b border-slate-200 px-4 py-3 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700"
          >
            <ListIcon />
            Menu
          </button>
        </div>
        <div className="p-4 md:p-6 lg:p-8 page-fade">{children}</div>
      </main>
    </div>
  );
}
