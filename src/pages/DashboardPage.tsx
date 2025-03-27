
import { SideNav } from "@/components/dashboard/SideNav";
import { RepositoryCard } from "@/components/dashboard/RepositoryCard";
import { MetricsPanel } from "@/components/dashboard/MetricsPanel";
import { StudentComparisonChart } from "@/components/dashboard/StudentComparisonChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FolderPlus } from "lucide-react";

// Sample repository data
const repositories = [
  {
    name: "Team Alpha Project",
    description: "Software Engineering final project for Team Alpha",
    lastActivity: "Today at 13:45",
    commitCount: 127,
    mergeRequestCount: 18,
    branchCount: 5,
    progress: 68,
    predictedGrade: "B+"
  },
  {
    name: "Web Development Course",
    description: "Web development course repository for CS301",
    lastActivity: "Yesterday at 09:22",
    commitCount: 84,
    mergeRequestCount: 12,
    branchCount: 3,
    progress: 75,
    predictedGrade: "A-"
  },
  {
    name: "Algorithm Analysis",
    description: "Team project for algorithm performance analysis",
    lastActivity: "3 days ago",
    commitCount: 56,
    mergeRequestCount: 7,
    branchCount: 2,
    progress: 42
  }
];

// Uncomment this line to show empty state
// const repositories = [];

export default function DashboardPage() {
  const repositoryCount = repositories.length;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SideNav />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="flex flex-col mb-8">
            <h1 className="text-2xl font-semibold tracking-tight animate-fade-in">Dashboard</h1>
            <p className="text-muted-foreground animate-fade-in opacity-0" style={{ animationDelay: "100ms" }}>
              Manage your repositories and analyze student performance
            </p>
            <p className="text-xl font-medium text-primary animate-fade-in opacity-0" style={{ animationDelay: "150ms" }}>
              Bem-vindo Sr. Professor
            </p>
          </div>
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                {repositoryCount === 0 
                  ? "You don't have any repositories yet. Create your first repository to get started." 
                  : `You have ${repositoryCount} ${repositoryCount === 1 ? 'repository' : 'repositories'}.`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search repositories..." 
                  className="pl-9 w-[240px] h-9"
                />
              </div>
              <Button size="lg" className="h-10 px-5">
                <Plus className="h-5 w-5 mr-2" />
                New Repository
              </Button>
            </div>
          </div>
          
          {repositories.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {repositories.map((repo, index) => (
                  <div key={repo.name} className="animate-fade-in opacity-0" style={{ animationDelay: `${index * 100 + 200}ms` }}>
                    <RepositoryCard {...repo} />
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="animate-fade-in opacity-0" style={{ animationDelay: "500ms" }}>
                  <StudentComparisonChart />
                </div>
                <div className="animate-fade-in opacity-0" style={{ animationDelay: "600ms" }}>
                  <MetricsPanel />
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 animate-fade-in opacity-0" style={{ animationDelay: "200ms" }}>
              <div className="bg-muted/50 p-8 rounded-lg flex flex-col items-center max-w-md">
                <FolderPlus className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No repositories found</h3>
                <p className="text-center text-muted-foreground mb-6">
                  Create your first repository to start tracking student progress and analyzing their performance.
                </p>
                <Button size="lg" className="w-full">
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Repository
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
