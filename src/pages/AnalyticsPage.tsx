
import { SideNav } from "@/components/dashboard/SideNav";
import { AnalyticsPanel } from "@/components/dashboard/AnalyticsPanel";

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav />
      <main className="flex-1 overflow-y-auto p-4 bg-background">
        <div className="space-y-4 max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold tracking-tight">Analytics</h1>
              <p className="text-sm text-muted-foreground">
                Compare repositories and predict student performance
              </p>
            </div>
          </div>
          
          <AnalyticsPanel />
        </div>
      </main>
    </div>
  );
}
