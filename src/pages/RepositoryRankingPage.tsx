
import { useState, useEffect } from "react";
import { SideNav } from "@/components/dashboard/SideNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftIcon, Medal, GitCommitIcon, CodeIcon, UserIcon, Rocket, GitMergeIcon } from "lucide-react";
import { getRepositories, Repository } from "@/services/repositoryData";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Define ranking categories
const rankingCategories = [
  { id: "commits", name: "Most Commits", icon: <GitCommitIcon className="h-4 w-4" />, key: "commitCount" },
  { id: "operations", name: "Most Operations", icon: <CodeIcon className="h-4 w-4" />, key: "operations" },
  { id: "progress", name: "Project Progress", icon: <Rocket className="h-4 w-4" />, key: "progress" },
  { id: "grade", name: "Highest Grade Prediction", icon: <Medal className="h-4 w-4" />, key: "finalGradePrediction" },
];

export default function RepositoryRankingPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("commits");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepositories = async () => {
      setLoading(true);
      try {
        const fetchedRepositories = await getRepositories();
        setRepositories(fetchedRepositories);
      } catch (error) {
        console.error("Error fetching repositories:", error);
        toast.error("Failed to load repositories", {
          description: "Please try again later."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRepositories();
  }, []);

  const handleGoBack = () => {
    navigate("/repositories");
  };

  const handleRepositoryClick = (repoId: string) => {
    navigate(`/repositories/${repoId}`);
  };

  // Get sorted repositories based on selected category
  const getSortedRepositories = (): Repository[] => {
    const category = rankingCategories.find(c => c.id === selectedCategory);
    if (!category) return [...repositories];
    
    const key = category.key as keyof Repository;
    
    // Special case for grade prediction (needs to be converted to numeric value)
    if (key === "finalGradePrediction") {
      return [...repositories].sort((a, b) => {
        const gradeToNumber = (grade: string | undefined) => {
          if (!grade) return 0;
          switch (grade.toUpperCase()[0]) {
            case 'A': return 5;
            case 'B': return 4;
            case 'C': return 3;
            case 'D': return 2;
            case 'F': return 1;
            default: return 0;
          }
        };
        
        return gradeToNumber(b[key] as string) - gradeToNumber(a[key] as string);
      });
    }
    
    // Sort numerically for other categories
    return [...repositories].sort((a, b) => {
      const aValue = a[key] as number || 0;
      const bValue = b[key] as number || 0;
      return bValue - aValue;
    });
  };

  const rankColor = (index: number): string => {
    if (index === 0) return "text-yellow-500 border-yellow-500";
    if (index === 1) return "text-gray-400 border-gray-400";
    if (index === 2) return "text-amber-700 border-amber-700";
    return "text-muted-foreground border-muted-foreground/40";
  };

  const getScoreLabel = (repo: Repository, category: string): string => {
    switch (category) {
      case "commits":
        return `${repo.commitCount || 0} commits`;
      case "operations":
        return `${repo.operations || 0} operations`;
      case "progress":
        return `${repo.progress || 0}% complete`;
      case "grade":
        return repo.finalGradePrediction || "Not graded";
      default:
        return "";
    }
  };

  const sortedRepositories = getSortedRepositories();

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleGoBack}>
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back
              </Button>
              <h1 className="text-2xl font-semibold">Repository Rankings</h1>
            </div>
          </div>
          
          <Tabs 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <TabsList className="mb-4">
              {rankingCategories.map(category => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                  {category.icon}
                  <span>{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={selectedCategory} className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    {rankingCategories.find(c => c.id === selectedCategory)?.icon}
                    <span>{rankingCategories.find(c => c.id === selectedCategory)?.name} Ranking</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : sortedRepositories.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-muted-foreground">No repositories found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortedRepositories.slice(0, 10).map((repo, index) => (
                        <div 
                          key={repo.id} 
                          className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => handleRepositoryClick(repo.id || "")}
                        >
                          <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 font-bold text-sm ${rankColor(index)}`}>
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium truncate">{repo.name}</h3>
                              <Badge variant="outline" className="shrink-0">
                                {getScoreLabel(repo, selectedCategory)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <UserIcon className="h-3 w-3" />
                              <span>{repo.author || "Unknown"}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
