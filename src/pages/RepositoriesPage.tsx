
import { useState, useEffect } from "react";
import { SideNav } from "@/components/dashboard/SideNav";
import { CreateRepositoryDialog } from "@/components/dashboard/CreateRepositoryDialog";
import { RepositoriesHeader } from "@/components/dashboard/RepositoriesHeader";
import { RepositoryControls } from "@/components/dashboard/RepositoryControls";
import { RepositoriesList } from "@/components/dashboard/RepositoriesList";
import { 
  getRepositories,
  sampleStudents, 
  programmingStudents,
  filterRepositories,
  sortRepositories
} from "@/services/repositoryData";

export default function RepositoriesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showGradesTemplate, setShowGradesTemplate] = useState(false);
  const [selectedRepository, setSelectedRepository] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [repositories, setRepositories] = useState([]);
  
  // Refresh repositories when dialog opens/closes, when component mounts, 
  // or when navigating back to this page
  useEffect(() => {
    const fetchRepositories = () => {
      const fetchedRepositories = getRepositories();
      
      // Enhance repositories with the new fields required for the updated table
      const enhancedRepositories = fetchedRepositories.map(repo => ({
        ...repo,
        projectId: repo.projectId || repo.id || `project-${Math.random().toString(36).substr(2, 9)}`,
        author: repo.author || "Anonymous",
        email: repo.email || "no-email@example.com",
        date: repo.date || repo.lastActivity,
        additions: repo.additions || Math.floor(Math.random() * 500),
        deletions: repo.deletions || Math.floor(Math.random() * 200),
        operations: repo.operations || (repo.additions && repo.deletions ? repo.additions + repo.deletions : repo.commitCount)
      }));
      
      setRepositories(enhancedRepositories);
    };

    fetchRepositories();

    // Add event listener for focus to refresh data when user comes back to the page
    window.addEventListener('focus', fetchRepositories);
    
    return () => {
      window.removeEventListener('focus', fetchRepositories);
    };
  }, [dialogOpen]);
  
  const filteredRepositories = filterRepositories(repositories, searchTerm);
  const sortedRepositories = sortRepositories(filteredRepositories, sortBy);

  const handleRepositorySelect = (repoId: string) => {
    setSelectedRepository(repoId);
    setShowGradesTemplate(true);
  };

  const toggleGradesView = () => {
    setShowGradesTemplate(!showGradesTemplate);
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  const handleRepositoryCreated = () => {
    // Refresh repositories after creation
    const fetchedRepositories = getRepositories();
    
    // Enhance repositories with the fields needed for the updated table
    const enhancedRepositories = fetchedRepositories.map(repo => ({
      ...repo,
      projectId: repo.projectId || repo.id || `project-${Math.random().toString(36).substr(2, 9)}`,
      author: repo.author || "Anonymous",
      email: repo.email || "no-email@example.com",
      date: repo.date || repo.lastActivity,
      additions: repo.additions || Math.floor(Math.random() * 500),
      deletions: repo.deletions || Math.floor(Math.random() * 200),
      operations: repo.operations || (repo.additions && repo.deletions ? repo.additions + repo.deletions : repo.commitCount)
    }));
    
    setRepositories(enhancedRepositories);
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
            onViewModeChange={handleViewModeChange}
            onToggleGradesView={toggleGradesView}
            showGradesTemplate={showGradesTemplate}
          />
          
          <RepositoriesList 
            repositories={sortedRepositories}
            viewMode={viewMode}
            showGradesTemplate={showGradesTemplate}
            selectedRepository={selectedRepository}
            programmingStudents={programmingStudents}
            sampleStudents={sampleStudents}
            onRepositorySelect={handleRepositorySelect}
          />
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
