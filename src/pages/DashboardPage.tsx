
import { useState } from "react";
import { SideNav } from "@/components/dashboard/SideNav";
import { RepositoryCard } from "@/components/dashboard/RepositoryCard";
import { StudentComparisonChart } from "@/components/dashboard/StudentComparisonChart";
import { CreateRepositoryDialog } from "@/components/dashboard/CreateRepositoryDialog";
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const repositoryCount = repositories.length;

  const handleCreateRepository = () => {
    setDialogOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SideNav />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex flex-col mb-4">
            <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Manage your repositories and analyze student performance
            </p>
            <p className="text-base font-medium text-primary mt-1">
              Bem-vindo Sr. Professor
            </p>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                {repositoryCount === 0 
                  ? "You don't have any repositories yet. Create your first repository to get started." 
                  : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  placeholder="Search repositories..." 
                  className="pl-8 w-[200px] h-8 text-sm"
                />
              </div>
              <Button size="sm" onClick={handleCreateRepository}>
                <Plus className="h-4 w-4 mr-1" />
                New Repository
              </Button>
            </div>
          </div>
          
          {repositories.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {repositories.map((repo, index) => (
                  <div key={repo.name}>
                    <RepositoryCard {...repo} />
                  </div>
                ))}
              </div>
              
              <div className="mb-4">
                <StudentComparisonChart />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-muted/50 p-6 rounded-lg flex flex-col items-center max-w-md">
                <FolderPlus className="h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-base font-medium mb-1">No repositories found</h3>
                <p className="text-center text-xs text-muted-foreground mb-4">
                  Create your first repository to start tracking student progress and analyzing their performance.
                </p>
                <Button size="sm" className="w-full" onClick={handleCreateRepository}>
                  <Plus className="h-4 w-4 mr-1" />
                  Create New Repository
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <CreateRepositoryDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
      />
    </div>
  );
}
