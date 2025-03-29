
import { useState, useEffect } from "react";
import { SideNav } from "@/components/dashboard/SideNav";
import { RepositoriesHeader } from "@/components/dashboard/RepositoriesHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Download, Filter, ChevronUp, ChevronDown, Info } from "lucide-react";
import { getRepositories, Repository } from "@/services/repositoryData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

// Available metrics for ranking
const metrics = [
  { id: "commit_count", name: "Commit Count", description: "Total number of commits in the repository" },
  { id: "merge_request_count", name: "Merge Requests", description: "Total number of merge requests" },
  { id: "branch_count", name: "Branch Count", description: "Number of active branches" },
  { id: "progress", name: "Progress", description: "Overall completion percentage" },
  { id: "predicted_grade", name: "Predicted Grade", description: "AI-predicted final grade" }
];

// Time periods for filtering
const timePeriods = [
  { id: "all", name: "All Time" },
  { id: "semester", name: "This Semester" },
  { id: "month", name: "Last 30 Days" },
  { id: "week", name: "Last 7 Days" }
];

export default function RepositoryRankingPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState(metrics[0].id);
  const [timePeriod, setTimePeriod] = useState(timePeriods[0].id);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch repositories on component mount
  useEffect(() => {
    try {
      const repos = getRepositories();
      setRepositories(repos);
    } catch (error) {
      console.error("Error fetching repositories:", error);
      toast.error("Failed to load repositories");
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper function to get the value from repository based on selected metric
  const getMetricValue = (repo: Repository, metricId: string) => {
    switch(metricId) {
      case "commit_count":
        return repo.commitCount;
      case "merge_request_count":
        return repo.mergeRequestCount;
      case "branch_count":
        return repo.branchCount;
      case "progress":
        return repo.progress;
      case "predicted_grade":
        return repo.predictedGrade || "N/A";
      default:
        return 0;
    }
  };

  // Format the metric value for display
  const formatMetricValue = (value: any, metricId: string) => {
    if (metricId === "progress") {
      return `${value}%`;
    }
    if (metricId === "predicted_grade") {
      return value;
    }
    return value.toLocaleString();
  };

  // Get the current metric name
  const currentMetric = metrics.find(m => m.id === selectedMetric);

  // Sort repositories based on selected metric and direction
  const sortedRepositories = [...repositories].sort((a, b) => {
    const aValue = getMetricValue(a, selectedMetric);
    const bValue = getMetricValue(b, selectedMetric);
    
    // Handle special case for grades (A+, A, A-, B+, etc.)
    if (selectedMetric === "predicted_grade") {
      if (!aValue || aValue === "N/A") return sortDirection === "asc" ? -1 : 1;
      if (!bValue || bValue === "N/A") return sortDirection === "asc" ? 1 : -1;
      return sortDirection === "asc" 
        ? bValue.localeCompare(aValue) 
        : aValue.localeCompare(bValue);
    }
    
    return sortDirection === "asc" 
      ? aValue - bValue 
      : bValue - aValue;
  });

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // Get ranking color based on position
  const getRankingColor = (position: number) => {
    if (position === 0) return "text-yellow-500";
    if (position === 1) return "text-gray-400";
    if (position === 2) return "text-amber-700";
    return "text-slate-700";
  };

  // Handle export functionality
  const handleExport = () => {
    try {
      const headers = ["Rank", "Repository", `${currentMetric?.name}`, "Last Activity"];
      
      const csvData = [
        headers.join(','),
        ...sortedRepositories.map((repo, index) => 
          [
            index + 1,
            `"${repo.name}"`,
            `"${formatMetricValue(getMetricValue(repo, selectedMetric), selectedMetric)}"`,
            `"${repo.lastActivity}"`
          ].join(',')
        )
      ].join('\n');
      
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `repository-rankings-${selectedMetric}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Rankings exported successfully");
    } catch (error) {
      console.error("Error exporting rankings:", error);
      toast.error("Failed to export rankings");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SideNav />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          <RepositoriesHeader onAddRepository={() => {}} />
          
          <Card className="animate-fade-in">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Repository Rankings</CardTitle>
                  <CardDescription>
                    Compare repositories by performance metrics
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast.info("Filters will be available in a future update")}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleExport}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Rankings
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Trophy className="h-8 w-8 animate-pulse text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-4">
                    <div className="w-full md:w-auto">
                      <h3 className="text-sm font-medium mb-2">Ranking Metric</h3>
                      <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                        <SelectTrigger className="w-[240px]">
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
                      <Select value={timePeriod} onValueChange={setTimePeriod}>
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
                    
                    <div className="w-full md:w-auto ml-auto">
                      <h3 className="text-sm font-medium mb-2">Sort Direction</h3>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={toggleSortDirection}
                        className="w-[200px] justify-between"
                      >
                        {sortDirection === "desc" ? "Highest to Lowest" : "Lowest to Highest"}
                        {sortDirection === "desc" ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16 text-center">Rank</TableHead>
                          <TableHead>Repository</TableHead>
                          <TableHead className="w-64">
                            <div className="flex items-center space-x-1">
                              <span>{currentMetric?.name}</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="w-[200px]">{currentMetric?.description}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableHead>
                          <TableHead className="w-32 text-right">Last Activity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedRepositories.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                              No repositories found
                            </TableCell>
                          </TableRow>
                        ) : (
                          sortedRepositories.map((repo, index) => (
                            <TableRow key={repo.id || index} className="hover:bg-muted/50">
                              <TableCell className="text-center font-medium">
                                {index < 3 ? (
                                  <div className={`flex justify-center ${getRankingColor(index)}`}>
                                    <Trophy className="h-5 w-5" />
                                  </div>
                                ) : (
                                  <span className="text-slate-700">{index + 1}</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{repo.name}</div>
                                  <div className="text-xs text-muted-foreground">{repo.description}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">
                                  {formatMetricValue(getMetricValue(repo, selectedMetric), selectedMetric)}
                                </div>
                              </TableCell>
                              <TableCell className="text-right text-muted-foreground">
                                {repo.lastActivity}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Top Repository</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-lg font-bold">{sortedRepositories[0]?.name || "N/A"}</div>
                        <p className="text-xs text-muted-foreground">
                          {currentMetric?.name}: {sortedRepositories[0] ? formatMetricValue(getMetricValue(sortedRepositories[0], selectedMetric), selectedMetric) : "N/A"}
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Average {currentMetric?.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {selectedMetric === "predicted_grade" ? "N/A" : 
                            repositories.length === 0 ? "N/A" :
                            formatMetricValue(
                              Math.round(
                                repositories.reduce((sum, repo) => {
                                  const value = getMetricValue(repo, selectedMetric);
                                  return typeof value === "number" ? sum + value : sum;
                                }, 0) / Math.max(1, repositories.length)
                              ),
                              selectedMetric
                            )
                          }
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Across {repositories.length} repositories
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Range Difference</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {selectedMetric === "predicted_grade" || repositories.length < 2 ? "N/A" : 
                            formatMetricValue(
                              Math.round(
                                getMetricValue(sortedRepositories[0], selectedMetric) - 
                                getMetricValue(sortedRepositories[sortedRepositories.length - 1], selectedMetric)
                              ),
                              selectedMetric
                            )
                          }
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Between highest and lowest ranked repositories
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
