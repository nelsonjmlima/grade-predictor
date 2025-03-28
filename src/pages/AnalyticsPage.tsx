
import { SideNav } from "@/components/dashboard/SideNav";
import { AnalyticsPanel } from "@/components/dashboard/AnalyticsPanel";

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="space-y-6 max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Análises</h1>
              <p className="text-muted-foreground">
                Compare repositórios e preveja o desempenho dos alunos
              </p>
            </div>
          </div>
          
          <AnalyticsPanel />
        </div>
      </main>
    </div>
  );
}
