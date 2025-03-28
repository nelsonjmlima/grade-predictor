
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
    name: "Projeto Equipe Alfa",
    description: "Projeto final de Engenharia de Software para a Equipe Alfa",
    lastActivity: "Hoje às 13:45",
    commitCount: 127,
    mergeRequestCount: 18,
    branchCount: 5,
    progress: 68,
    predictedGrade: "B+"
  },
  {
    name: "Curso de Desenvolvimento Web",
    description: "Repositório do curso de desenvolvimento web para CS301",
    lastActivity: "Ontem às 09:22",
    commitCount: 84,
    mergeRequestCount: 12,
    branchCount: 3,
    progress: 75,
    predictedGrade: "A-"
  },
  {
    name: "Análise de Algoritmos",
    description: "Projeto em equipe para análise de desempenho de algoritmos",
    lastActivity: "3 dias atrás",
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
        <div className="p-6">
          <div className="flex flex-col mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Painel</h1>
            <p className="text-muted-foreground">
              Gerencie seus repositórios e analise o desempenho dos alunos
            </p>
            <p className="text-xl font-medium text-primary mt-2">
              Bem-vindo Sr. Professor
            </p>
          </div>
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                {repositoryCount === 0 
                  ? "Você não tem nenhum repositório ainda. Crie seu primeiro repositório para começar." 
                  : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Pesquisar repositórios..." 
                  className="pl-9 w-[240px] h-9"
                />
              </div>
              <Button size="lg" className="h-10 px-5" onClick={handleCreateRepository}>
                <Plus className="h-5 w-5 mr-2" />
                Novo Repositório
              </Button>
            </div>
          </div>
          
          {repositories.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {repositories.map((repo, index) => (
                  <div key={repo.name}>
                    <RepositoryCard {...repo} />
                  </div>
                ))}
              </div>
              
              <div className="mb-6">
                <StudentComparisonChart />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="bg-muted/50 p-8 rounded-lg flex flex-col items-center max-w-md">
                <FolderPlus className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Nenhum repositório encontrado</h3>
                <p className="text-center text-muted-foreground mb-6">
                  Crie seu primeiro repositório para começar a rastrear o progresso dos alunos e analisar seu desempenho.
                </p>
                <Button size="lg" className="w-full" onClick={handleCreateRepository}>
                  <Plus className="h-5 w-5 mr-2" />
                  Criar Novo Repositório
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
