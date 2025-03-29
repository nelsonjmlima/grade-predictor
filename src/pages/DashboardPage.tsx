
import { useState, useEffect } from "react";
import { SideNav } from "@/components/dashboard/SideNav";
import { RepositoryCard } from "@/components/dashboard/RepositoryCard";
import { StudentComparisonChart } from "@/components/dashboard/StudentComparisonChart";
import { CreateRepositoryDialog } from "@/components/dashboard/CreateRepositoryDialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { allRepositories } from "@/services/repositoryData";

export default function DashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [repositories, setRepositories] = useState(allRepositories);
  const navigate = useNavigate();

  // Listen for changes to allRepositories
  useEffect(() => {
    setRepositories(allRepositories);
  }, []);

  const handleRepositoryClick = (repoId: string) => {
    navigate(`/repositories/${repoId}`);
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
                {repositories.length > 0 
                  ? `Currently managing ${repositories.length} repositories.` 
                  : "No repositories created yet."}
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
            </div>
          </div>
          
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repositories.slice(0, 3).map((repo) => (
              <div 
                key={repo.id}
                className="cursor-pointer transform transition-transform hover:scale-[1.01]"
                onClick={() => handleRepositoryClick(repo.id || '')}
              >
                <RepositoryCard {...repo} />
              </div>
            ))}
            
            {repositories.length === 0 && (
              <div className="col-span-3 p-8 border border-dashed rounded-lg flex flex-col items-center justify-center text-center">
                <p className="text-muted-foreground mb-2">No repositories available</p>
                <p className="text-sm text-muted-foreground">Visit the Repositories page to create your first repository</p>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <StudentComparisonChart />
          </div>
        </div>
      </main>

      <CreateRepositoryDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
      />
    </div>
  );
}
