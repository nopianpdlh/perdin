import { PageLoadingState } from "@/components/LoadingState";

export default function DashboardLoading() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <PageLoadingState label="Memuat halaman dashboard..." />
    </div>
  );
}
