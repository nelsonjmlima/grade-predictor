
import { SlidersHorizontal } from "lucide-react";
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
}

export function RepositoriesList({
  repositories,
  viewMode,
  showGradesTemplate,
  selectedRepository,
  programmingStudents,
  sampleStudents,
  onRepositorySelect
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
      <div className="mb-8">
        <RepositoryGradesView 
          repositoryName={selectedRepository === 'programming-fundamentals' ? "Programming Fundamentals 2023" : "Advanced Programming Course"} 
          students={selectedRepository === 'programming-fundamentals' ? programmingStudents : sampleStudents} 
        />
        <div className="mt-6 p-3 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground">
            {selectedRepository === 'programming-fundamentals' 
              ? "Mostrando dados detalhados de alunos para Programming Fundamentals 2023." 
              : "Esta é uma visualização de modelo mostrando como repositórios com notas de alunos apareceriam."} 
            Clique no botão <SlidersHorizontal className="h-3 w-3 inline mx-1" /> para alternar de volta para a visualização regular do repositório.
          </p>
        </div>
      </div>
    );
  }

  // Find the Programming Fundamentals repository to display it first
  const programmingFundamentalsRepo = repositories.find(repo => repo.id === 'programming-fundamentals');
  const otherRepositories = repositories.filter(repo => repo.id !== 'programming-fundamentals');
  
  // Combine repositories with Programming Fundamentals first if it exists
  const orderedRepositories = programmingFundamentalsRepo 
    ? [programmingFundamentalsRepo, ...otherRepositories] 
    : repositories;

  return (
    <ScrollArea className="h-full">
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "space-y-4"
      }>
        {orderedRepositories.map((repo) => (
          <div 
            key={repo.name} 
            className="cursor-pointer transform transition-transform hover:scale-[1.02]"
            onClick={() => handleRepositoryClick(repo)}
          >
            <RepositoryCard {...repo} />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
