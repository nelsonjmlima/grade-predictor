
import { useState, useEffect } from "react";
import { SideNav } from "@/components/dashboard/SideNav";
import { RepositoriesHeader } from "@/components/dashboard/RepositoriesHeader";
import { RepositoryComparisonChart } from "@/components/dashboard/RepositoryComparisonChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, GitBranch, Users, ArrowLeftRight, Filter, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { getRepositories, Repository } from "@/services/repositoryData";

// Sample metrics data
const metrics = [
  { id: "commit_frequency", name: "Commit Frequency" },
  { id: "code_quality", name: "Code Quality" },
  { id: "test_coverage", name: "Test Coverage" },
  { id: "completion_rate", name: "Completion Rate" },
  { id: "collaboration", name: "Collaboration Score" },
];

// Sample time periods
const timePeriods = [
  { id: "week", name: "Weekly" },
  { id: "month", name: "Monthly" },
  { id: "semester", name: "Full Semester" },
];

export default function RepositoryComparisonPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [selectedMetric, setSelectedMetric] = useState(metrics[0].id);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(timePeriods[2].id);
  const [viewType, setViewType] = useState("line");
  const [loading, setLoading] = useState(true);
  const [animatedItems, setAnimatedItems] = useState<string[]>([]);

  // Animation sequence function
  const animateSequentially = () => {
    const itemsToAnimate = [
      "header", "controls", "repositories", 
      "chart", "stats-avg", "stats-top", "stats-gap"
    ];
    
    let delay = 100;
    const interval = 150; // ms between each animation
    
    itemsToAnimate.forEach(item => {
      setTimeout(() => {
        setAnimatedItems(prev => [...prev, item]);
      }, delay);
      delay += interval;
    });
  };

  // Load repositories
  useEffect(() => {
    try {
      const repos = getRepositories();
      setRepositories(repos);
      
      // Default to selecting first two repositories if available
      if (repos.length > 0) {
        const repoIds = repos.slice(0, Math.min(2, repos.length)).map(repo => repo.id || "");
        setSelectedRepos(repoIds.filter(id => id !== ""));
      }
    } catch (error) {
      console.error("Error loading repositories:", error);
      toast.error("Failed to load repositories");
    } finally {
      setLoading(false);
      
      // Start animation sequence after loading
      setTimeout(animateSequentially, 300);
    }
  }, []);

  const toggleRepository = (repoId: string) => {
    if (selectedRepos.includes(repoId)) {
      setSelectedRepos(selectedRepos.filter(id => id !== repoId));
    } else {
      setSelectedRepos([...selectedRepos, repoId]);
    }
  };

  const handleExport = () => {
    try {
      // Generate a CSV export of the comparison data
      const headers = ["Time Point", ...selectedRepos.map(repoId => {
        const repo = repositories.find(r => r.id === repoId);
        return repo?.name || "Unknown";
      })];
      
      const timePoints = selectedTimePeriod === "week" 
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : selectedTimePeriod === "month"
          ? ["Week 1", "Week 2", "Week 3", "Week 4"]
          : ["Week 1", "Week 3", "Week 6", "Week 9", "Week 12", "Week 15"];
      
      const csvData = [
        headers.join(','),
        ...timePoints.map((timePoint, index) => {
          const values = [timePoint];
          
          // Add data for each selected repository
          selectedRepos.forEach(repoId => {
            const repo = repositories.find(r => r.id === repoId);
            if (repo) {
              // Generate a sample value
              const baseValue = repo.progress;
              const variance = Math.sin(index * 0.5) * 10;
              const value = Math.round(Math.max(0, Math.min(100, baseValue + variance)));
              values.push(value.toString());
            } else {
              values.push("0");
            }
          });
          
          return values.join(',');
        })
      ].join('\n');
      
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `repository-comparison-${selectedMetric}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Comparison data exported successfully", {
        description: "The CSV file has been downloaded to your device."
      });
    } catch (error) {
      console.error("Error exporting chart:", error);
      toast.error("Failed to export chart data");
    }
  };

  // Calculate average performance
  const calculateAveragePerformance = () => {
    if (selectedRepos.length === 0) return 0;
    
    const selectedRepositories = repositories.filter(repo => 
      selectedRepos.includes(repo.id || "")
    );
    
    const sum = selectedRepositories.reduce((acc, repo) => acc + repo.progress, 0);
    return (sum / selectedRepositories.length).toFixed(1);
  };

  // Find top repository
  const findTopRepository = () => {
    if (selectedRepos.length === 0) return null;
    
    const selectedRepositories = repositories.filter(repo => 
      selectedRepos.includes(repo.id || "")
    );
    
    if (selectedRepositories.length === 0) return null;
    
    return selectedRepositories.reduce((prev, current) => 
      prev.progress > current.progress ? prev : current
    );
  };

  // Calculate performance gap
  const calculatePerformanceGap = () => {
    if (selectedRepos.length < 2) return 0;
    
    const selectedRepositories = repositories.filter(repo => 
      selectedRepos.includes(repo.id || "")
    );
    
    if (selectedRepositories.length < 2) return 0;
    
    const performances = selectedRepositories.map(repo => repo.progress);
    const max = Math.max(...performances);
    const min = Math.min(...performances);
    
    return (max - min).toFixed(1);
  };

  const topRepo = findTopRepository();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SideNav />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          <div className={`transition-all duration-500 ${animatedItems.includes("header") ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <RepositoriesHeader onAddRepository={() => {}} />
          </div>
          
          <Card className={`transition-all duration-500 ${animatedItems.includes("header") ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Repository Comparison</CardTitle>
                  <CardDescription>
                    Compare performance metrics across different repositories
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast.info("Filters will be available in a future update")}
                    className={`transition-all duration-300 ${animatedItems.includes("controls") ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleExport}
                    className={`transition-all duration-300 ${animatedItems.includes("controls") ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className={`transition-all duration-500 ${animatedItems.includes("controls") ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <h3 className="text-sm font-medium mb-2">Select Repositories</h3>
                  <div className="flex flex-wrap gap-2">
                    {repositories.map((repo, index) => (
                      <Button
                        key={repo.id || index}
                        variant={selectedRepos.includes(repo.id || "") ? "default" : "outline"}
                        size="sm"
                        className={`flex items-center transition-all duration-300 ${
                          animatedItems.includes("repositories") ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                        }`}
                        style={{ transitionDelay: `${index * 50}ms` }}
                        onClick={() => toggleRepository(repo.id || "")}
                      >
                        <GitBranch className="h-4 w-4 mr-2" />
                        {repo.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className={`flex flex-wrap gap-4 transition-all duration-500 ${animatedItems.includes("controls") ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className="w-full md:w-auto">
                    <h3 className="text-sm font-medium mb-2">Metric</h3>
                    <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select metric" />
                      </SelectTrigger>
                      <SelectContent>
                        {metrics.map((metric) => (
                          <SelectItem key={metric.id} value={metric.id}>
                            {metric.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full md:w-auto">
                    <h3 className="text-sm font-medium mb-2">Time Period</h3>
                    <Select value={selectedTimePeriod} onValueChange={setSelectedTimePeriod}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select time period" />
                      </SelectTrigger>
                      <SelectContent>
                        {timePeriods.map((period) => (
                          <SelectItem key={period.id} value={period.id}>
                            {period.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full md:w-auto">
                    <h3 className="text-sm font-medium mb-2">Display As</h3>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant={viewType === "line" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewType("line")}
                        className="transition-all duration-200"
                      >
                        Line Chart
                      </Button>
                      <Button
                        variant={viewType === "bar" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewType("bar")}
                        className="transition-all duration-200"
                      >
                        Bar Chart
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="repositories" className="mt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="repositories">Repository Comparison</TabsTrigger>
                  <TabsTrigger value="students">Student Comparison</TabsTrigger>
                  <TabsTrigger value="trends">Trends Analysis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="repositories" className="pt-4">
                  <div className={`transition-all duration-500 ${animatedItems.includes("chart") ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <RepositoryComparisonChart 
                      selectedRepos={selectedRepos}
                      repositories={repositories}
                      selectedMetric={selectedMetric}
                      viewType={viewType}
                      timePeriod={selectedTimePeriod}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="students" className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-medium">Student Performance Across Repositories</h3>
                      <p className="text-sm text-muted-foreground">
                        Compare how students perform across different repositories
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Users className="h-4 w-4 mr-2" />
                          Students
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.info("Student filtering coming soon")}>
                          All Students
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Performance filtering coming soon")}>
                          High Performers
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Performance filtering coming soon")}>
                          Low Performers
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Custom selection coming soon")}>
                          Custom Selection
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="rounded-md bg-muted p-8 h-[400px] flex flex-col items-center justify-center">
                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">
                      Student performance comparison will be available soon
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => toast.info("This feature is coming in a future update")}
                    >
                      Activate Student Comparison
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="trends" className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-medium">Performance Trends Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        Analyze trends and patterns over time
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toast.info("Period comparison is coming soon")}
                    >
                      <ArrowLeftRight className="h-4 w-4 mr-2" />
                      Compare Periods
                    </Button>
                  </div>
                  
                  <div className="rounded-md bg-muted p-8 h-[400px] flex flex-col items-center justify-center">
                    <ArrowLeftRight className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">
                      Performance trends analysis will be available soon
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => toast.info("This feature is coming in a future update")}
                    >
                      Activate Trends Analysis
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Card className={`transition-all duration-500 ${animatedItems.includes("stats-avg") ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Average Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold animate-fade-in">{calculateAveragePerformance()}%</div>
                    <p className="text-xs text-muted-foreground">
                      Across {selectedRepos.length} repositories
                    </p>
                  </CardContent>
                </Card>
                
                <Card className={`transition-all duration-500 ${animatedItems.includes("stats-top") ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Top Repository</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {topRepo ? (
                      <>
                        <div className="text-lg font-bold animate-fade-in">{topRepo.name}</div>
                        <p className="text-xs text-muted-foreground">
                          Performance: {topRepo.progress}%
                        </p>
                      </>
                    ) : (
                      <div className="text-muted-foreground">No data available</div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className={`transition-all duration-500 ${animatedItems.includes("stats-gap") ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Performance Gap</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold animate-fade-in">{calculatePerformanceGap()}%</div>
                    <p className="text-xs text-muted-foreground">
                      Between highest and lowest performing repositories
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
