
import { useState, useEffect } from "react";
import { SideNav } from "@/components/dashboard/SideNav";
import { RepositoryCard } from "@/components/dashboard/RepositoryCard";
import { RepositoriesTable } from "@/components/dashboard/RepositoriesTable";
import { CreateRepositoryDialog } from "@/components/dashboard/CreateRepositoryDialog";
import { RepositoriesHeader } from "@/components/dashboard/RepositoriesHeader";
import { RepositoryControls } from "@/components/dashboard/RepositoryControls";
import { RepositoriesList } from "@/components/dashboard/RepositoriesList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Grid, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  getRepositories, 
  filterRepositories, 
  sortRepositories,
  sampleStudents,
  programmingStudents,
  Repository 
} from "@/services/repositoryData";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");
  const [showGradesTemplate, setShowGradesTemplate] = useState(false);
  const [selectedRepository, setSelectedRepository] = useState('');
  const navigate = useNavigate();

  // Fetch repositories on mount and when dialogOpen changes (indicating a potential new repo)
  useEffect(() => {
    const fetchRepositories = () => {
      setRepositories(getRepositories());
    };

    fetchRepositories();

    // Add event listener for focus to refresh data when user comes back to the page
    window.addEventListener('focus', fetchRepositories);
    
    return () => {
      window.removeEventListener('focus', fetchRepositories);
    };
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

  const handleRepositorySelect = (repoId: string) => {
    setSelectedRepository(repoId);
    setShowGradesTemplate(true);
  };

  const toggleGradesView = () => {
    setShowGradesTemplate(!showGradesTemplate);
  };

  // Filter repositories based on search term
  const filteredRepositories = filterRepositories(repositories, searchTerm);
  
  // Sort repositories based on sort selection
  const sortedRepositories = sortRepositories(filteredRepositories, sortBy);

  const handleRepositoryCreated = () => {
    // Refresh repositories after creation
    setRepositories(getRepositories());
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SideNav />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-4">
          <RepositoriesHeader 
            onAddRepository={() => setDialogOpen(true)} 
          />
          
          <RepositoryControls 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={(mode) => setViewMode(mode as "grid" | "list")}
            onToggleGradesView={toggleGradesView}
            showGradesTemplate={showGradesTemplate}
          />
          
          {showGradesTemplate ? (
            <RepositoriesList 
              repositories={sortedRepositories}
              viewMode={viewMode}
              showGradesTemplate={showGradesTemplate}
              selectedRepository={selectedRepository}
              programmingStudents={programmingStudents}
              sampleStudents={sampleStudents}
              onRepositorySelect={handleRepositorySelect}
            />
          ) : viewMode === "grid" ? (
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedRepositories.length > 0 ? (
                sortedRepositories.map((repo) => (
                  <div 
                    key={repo.id || repo.name} 
                    className="cursor-pointer transform transition-transform hover:scale-[1.01]"
                    onClick={() => repo.id ? handleRepositoryClick(repo.id) : handleRepositorySelect('programming-fundamentals')}
                  >
                    <RepositoryCard {...repo} />
                  </div>
                ))
              ) : (
                <div className="col-span-full p-8 text-center">
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? "No repositories match your search. Try different keywords." 
                      : "No repositories found. Create your first repository to get started."}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-4">
              <RepositoriesTable repositories={sortedRepositories} />
            </div>
          )}
        </div>
      </main>

      <CreateRepositoryDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onRepositoryCreated={handleRepositoryCreated}
      />
    </div>
  );
}
