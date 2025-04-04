
import { SideNav } from "@/components/dashboard/SideNav";

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            View and analyze repository data with customizable charts and metrics.
          </p>
        </div>
      </main>
    </div>
  );
}
