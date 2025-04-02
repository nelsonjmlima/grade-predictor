
import { RepositoryCard } from "@/components/dashboard/RepositoryCard";
import { RepositoryGradesView } from "@/components/dashboard/RepositoryGradesView";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";

interface Repository {
  name: string;
  description: string;
  lastActivity: string;
  commitCount: number;
  mergeRequestCount: number;
  branchCount: number;
  progress: number;
  predictedGrade?: string;
  id?: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  commitCount: number;
  grade?: string;
  lastActivity: string;
}

interface RepositoriesListProps {
  repositories: Repository[];
  viewMode: 'grid' | 'list';
  showGradesTemplate: boolean;
  selectedRepository: string;
  programmingStudents: Student[];
  sampleStudents: Student[];
  onRepositorySelect: (repoId: string) => void;
  isLoading?: boolean;
}

export function RepositoriesList({
  repositories,
  viewMode,
  showGradesTemplate,
  selectedRepository,
  programmingStudents,
  sampleStudents,
  onRepositorySelect,
  isLoading = false
}: RepositoriesListProps) {
  const navigate = useNavigate();

  const handleRepositoryClick = (repo: Repository) => {
    if (repo.id) {
      navigate(`/repositories/${repo.id}`);
    } else {
      // For repositories without IDs, use the previous behavior
      onRepositorySelect('programming-fundamentals');
    }
  };

  if (showGradesTemplate) {
    return (
      <div className="mb-4">
        <RepositoryGradesView 
          repositoryName={selectedRepository === 'programming-fundamentals' ? "Programming Fundamentals 2023" : "Advanced Programming Course"} 
          students={selectedRepository === 'programming-fundamentals' ? programmingStudents : sampleStudents} 
        />
      </div>
    );
  }

  // Display loading state
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Loading repositories...</p>
      </div>
    );
  }

  // Display message if no repositories
  if (repositories.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No repositories found. Create your first repository to get started.</p>
      </div>
    );
  }

  // Display all repositories
  return (
    <ScrollArea className="h-full">
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
        : "space-y-3"
      }>
        {repositories.map((repo) => (
          <div 
            key={repo.id || repo.name} 
            className="cursor-pointer transform transition-transform hover:scale-[1.01]"
            onClick={() => handleRepositoryClick(repo)}
          >
            <RepositoryCard {...repo} />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
