
import { useState, useEffect } from "react";
import { SideNav } from "@/components/dashboard/SideNav";
import { RepositoryCard } from "@/components/dashboard/RepositoryCard";
import { RepositoriesTable } from "@/components/dashboard/RepositoriesTable";
import { StudentComparisonChart } from "@/components/dashboard/StudentComparisonChart";
import { CreateRepositoryDialog } from "@/components/dashboard/CreateRepositoryDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Grid, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRepositories, Repository, filterRepositories, sortRepositories } from "@/services/repositoryData";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sortBy, setSortBy] = useState("recent");
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

  // Filter repositories based on search term
  const filteredRepositories = filterRepositories(repositories, searchTerm);
  
  // Sort repositories based on sort selection
  const sortedRepositories = sortRepositories(filteredRepositories, sortBy);

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
                  ? `Managing ${repositories.length} repositories.`
                  : "No repositories available. Add your first repository."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  placeholder="Search repositories..." 
                  className="pl-8 w-[200px] h-8 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select 
                value={sortBy} 
                onValueChange={setSortBy}
              >
                <SelectTrigger className="h-8 w-[130px]">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                </SelectContent>
              </Select>
              <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "table")}>
                <ToggleGroupItem value="grid" aria-label="Grid view">
                  <Grid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="table" aria-label="Table view">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
              <Button size="sm" className="h-9 px-4" onClick={handleAddRepository}>
                <Plus className="h-4 w-4 mr-2" />
                Add Repository
              </Button>
            </div>
          </div>
          
          {viewMode === "grid" ? (
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedRepositories.length > 0 ? (
                sortedRepositories.map((repo) => (
                  <div 
                    key={repo.id || repo.name} 
                    className="cursor-pointer transform transition-transform hover:scale-[1.01]"
                    onClick={() => handleRepositoryClick(repo.id || '')}
                  >
                    <RepositoryCard {...repo} />
                  </div>
                ))
              ) : (
                <div className="col-span-full p-8 text-center">
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? "No repositories match your search. Try different keywords." 
                      : "No repositories available. Add your first repository."}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-4">
              <RepositoriesTable repositories={sortedRepositories} />
            </div>
          )}
          
          {repositories.length > 0 && (
            <div className="mb-4">
              <StudentComparisonChart />
            </div>
          )}
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
