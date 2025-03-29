
import { useState } from "react";
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

// Sample repository data
const repositories = [
  { id: 1, name: "Team Alpha Project" },
  { id: 2, name: "Web Development Course" },
  { id: 3, name: "Algorithm Analysis" },
  { id: 4, name: "Mobile App Development" },
  { id: 5, name: "Database Systems" },
];

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
  const [selectedRepos, setSelectedRepos] = useState<number[]>([1, 2]);
  const [selectedMetric, setSelectedMetric] = useState(metrics[0].id);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(timePeriods[2].id);
  const [viewType, setViewType] = useState("line");

  const toggleRepository = (repoId: number) => {
    if (selectedRepos.includes(repoId)) {
      setSelectedRepos(selectedRepos.filter(id => id !== repoId));
    } else {
      setSelectedRepos([...selectedRepos, repoId]);
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
                  <CardTitle>Repository Comparison</CardTitle>
                  <CardDescription>
                    Compare performance metrics across different repositories
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Select Repositories</h3>
                  <div className="flex flex-wrap gap-2">
                    {repositories.map((repo) => (
                      <Button
                        key={repo.id}
                        variant={selectedRepos.includes(repo.id) ? "default" : "outline"}
                        size="sm"
                        className="flex items-center"
                        onClick={() => toggleRepository(repo.id)}
                      >
                        <GitBranch className="h-4 w-4 mr-2" />
                        {repo.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
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
                      >
                        Line Chart
                      </Button>
                      <Button
                        variant={viewType === "bar" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewType("bar")}
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
                  <RepositoryComparisonChart 
                    selectedRepos={selectedRepos}
                    repositories={repositories}
                    selectedMetric={selectedMetric}
                    viewType={viewType}
                  />
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
                        <DropdownMenuItem>All Students</DropdownMenuItem>
                        <DropdownMenuItem>High Performers</DropdownMenuItem>
                        <DropdownMenuItem>Low Performers</DropdownMenuItem>
                        <DropdownMenuItem>Custom Selection</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="rounded-md bg-muted p-8 h-[400px] flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Student performance comparison chart would appear here
                    </p>
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
                    <Button variant="outline" size="sm">
                      <ArrowLeftRight className="h-4 w-4 mr-2" />
                      Compare Periods
                    </Button>
                  </div>
                  
                  <div className="rounded-md bg-muted p-8 h-[400px] flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Performance trends analysis would appear here
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Average Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">78.5%</div>
                    <p className="text-xs text-muted-foreground">
                      Across {selectedRepos.length} repositories
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Top Repository</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">Web Development Course</div>
                    <p className="text-xs text-muted-foreground">
                      Performance: 92.3%
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Performance Gap</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18.7%</div>
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
