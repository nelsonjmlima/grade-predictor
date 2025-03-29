
import { useState, useEffect } from "react";
import { SideNav } from "@/components/dashboard/SideNav";
import { RepositoryCard } from "@/components/dashboard/RepositoryCard";
import { StudentComparisonChart } from "@/components/dashboard/StudentComparisonChart";
import { CreateRepositoryDialog } from "@/components/dashboard/CreateRepositoryDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRepositories, Repository } from "@/services/repositoryData";

export default function DashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const navigate = useNavigate();

  // Fetch repositories on mount and when dialogOpen changes (indicating a potential new repo)
  useEffect(() => {
    const fetchedRepositories = getRepositories();
    setRepositories(fetchedRepositories);
  }, [dialogOpen]);

  const handleCreateRepository = () => {
    setDialogOpen(true);
  };

  const handleRepositoryClick = (repoId: string) => {
    navigate(`/repositories/${repoId}`);
  };

  const handleAddRepository = () => {
    navigate("/repositories/add");
  };

  // Get the main repository (either the first one or a specific featured one)
  const mainRepository = repositories.length > 0 ? repositories[0] : null;

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
                {mainRepository 
                  ? `Currently managing ${mainRepository.name}.`
                  : "No repositories available. Add your first repository."}
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
              <Button size="sm" className="h-9 px-4" onClick={handleAddRepository}>
                <Plus className="h-4 w-4 mr-2" />
                Add Repository
              </Button>
            </div>
          </div>
          
          <div className="mb-4">
            {mainRepository && (
              <div 
                className="cursor-pointer transform transition-transform hover:scale-[1.01]"
                onClick={() => handleRepositoryClick(mainRepository.id || '')}
              >
                <RepositoryCard {...mainRepository} />
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
        onRepositoryCreated={() => {
          // Refresh repositories after creation
          const updatedRepositories = getRepositories();
          setRepositories(updatedRepositories);
        }}
      />
    </div>
  );
}
