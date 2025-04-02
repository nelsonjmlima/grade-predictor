
import { useState, useEffect } from "react";
import { SideNav } from "@/components/dashboard/SideNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckIcon, InfoIcon, ArrowLeftIcon, BarChart3Icon, LineChartIcon, AlertCircleIcon } from "lucide-react";
import { getRepositories, Repository } from "@/services/repositoryData";
import { RepositoryComparisonChart } from "@/components/dashboard/RepositoryComparisonChart";
import { RepositoryComparisonTable } from "@/components/dashboard/RepositoryComparisonTable";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function RepositoryComparisonPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState("commit_frequency");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("semester");
  const [viewType, setViewType] = useState("line");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepositories = async () => {
      setLoading(true);
      try {
        const fetchedRepositories = await getRepositories();
        setRepositories(fetchedRepositories);
        
        // Pre-select first 3 repositories if available
        if (fetchedRepositories.length > 0) {
          const reposToSelect = fetchedRepositories
            .slice(0, Math.min(3, fetchedRepositories.length))
            .map(repo => repo.id || "")
            .filter(id => id); // Filter out empty ids
            
          setSelectedRepos(reposToSelect);
        }
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

  const handleRepoToggle = (repoId: string) => {
    if (selectedRepos.includes(repoId)) {
      setSelectedRepos(prev => prev.filter(id => id !== repoId));
    } else {
      // Max 5 repos for comparison
      if (selectedRepos.length < 5) {
        setSelectedRepos(prev => [...prev, repoId]);
      } else {
        toast.warning("Maximum repositories reached", {
          description: "You can compare up to 5 repositories at once."
        });
      }
    }
  };

  const handleViewTypeChange = (newViewType: string) => {
    setViewType(newViewType);
  };

  const handleMetricChange = (metric: string) => {
    setSelectedMetric(metric);
  };

  const handleTimePeriodChange = (period: string) => {
    setSelectedTimePeriod(period);
  };

  const handleGoBack = () => {
    navigate("/repositories");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleGoBack}>
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back
              </Button>
              <h1 className="text-2xl font-semibold">Repository Comparison</h1>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Repository Selection */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Select Repositories</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : repositories.length === 0 ? (
                  <div className="py-8 text-center">
                    <AlertCircleIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No repositories found</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                    {repositories.map(repo => (
                      <div 
                        key={repo.id} 
                        className={`flex items-center gap-2 p-3 rounded-md cursor-pointer transition-colors ${
                          selectedRepos.includes(repo.id || "") 
                            ? "bg-primary/10 border border-primary/30" 
                            : "hover:bg-muted border border-transparent"
                        }`}
                        onClick={() => handleRepoToggle(repo.id || "")}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          selectedRepos.includes(repo.id || "") 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted-foreground/20"
                        }`}>
                          {selectedRepos.includes(repo.id || "") && (
                            <CheckIcon className="h-3 w-3" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{repo.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {repo.finalGradePrediction 
                              ? `Grade: ${repo.finalGradePrediction}` 
                              : `Commits: ${repo.commitCount}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="pt-4 text-xs text-muted-foreground flex items-center">
                  <InfoIcon className="h-3 w-3 mr-1" />
                  <span>Select up to 5 repositories to compare</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Comparison Chart */}
            <Card className="lg:col-span-3">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-medium">Comparison Analysis</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 rounded-none ${viewType === 'line' ? 'bg-muted' : ''}`}
                        onClick={() => handleViewTypeChange('line')}
                      >
                        <LineChartIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 rounded-none ${viewType === 'bar' ? 'bg-muted' : ''}`}
                        onClick={() => handleViewTypeChange('bar')}
                      >
                        <BarChart3Icon className="h-4 w-4" />
                      </Button>
                    </div>
                    <Select value={selectedMetric} onValueChange={handleMetricChange}>
                      <SelectTrigger className="w-[160px] h-8">
                        <SelectValue placeholder="Select metric" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="commit_frequency">Commit Frequency</SelectItem>
                        <SelectItem value="code_quality">Code Quality</SelectItem>
                        <SelectItem value="test_coverage">Test Coverage</SelectItem>
                        <SelectItem value="completion_rate">Completion Rate</SelectItem>
                        <SelectItem value="collaboration">Collaboration</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedTimePeriod} onValueChange={handleTimePeriodChange}>
                      <SelectTrigger className="w-[130px] h-8">
                        <SelectValue placeholder="Time period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Weekly</SelectItem>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="semester">Semester</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <RepositoryComparisonChart 
                  selectedRepos={selectedRepos}
                  repositories={repositories}
                  selectedMetric={selectedMetric}
                  viewType={viewType}
                  timePeriod={selectedTimePeriod}
                />
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="metrics" className="w-full">
            <TabsList>
              <TabsTrigger value="metrics">Metrics Comparison</TabsTrigger>
              <TabsTrigger value="activity">Activity Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="metrics" className="mt-4">
              <RepositoryComparisonTable 
                repositories={repositories.filter(repo => selectedRepos.includes(repo.id || ""))}
              />
            </TabsContent>
            <TabsContent value="activity" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center py-10 text-muted-foreground">
                    Activity analysis data will be displayed here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
