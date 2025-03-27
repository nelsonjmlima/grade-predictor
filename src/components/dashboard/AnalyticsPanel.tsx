
import React, { useState } from "react";
import { 
  GitBranch, 
  Filter,
  ArrowLeftRight,
  TrendingUp,
  ChevronDown,
  Info,
  Plus
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MetricsPanel } from "./MetricsPanel";

const repositories = [
  { id: "repo1", name: "Project 1: Web Development" },
  { id: "repo2", name: "Project 2: Mobile App" },
  { id: "repo3", name: "Project 3: Data Structures" },
  { id: "repo4", name: "Project 4: Algorithms" },
];

export function AnalyticsPanel() {
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState("last_30_days");
  const [showPredictions, setShowPredictions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const handleToggleRepo = (repoId: string) => {
    setSelectedRepos(prev => 
      prev.includes(repoId) 
        ? prev.filter(id => id !== repoId) 
        : [...prev, repoId]
    );
  };

  return (
    <div className="space-y-6">
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Repository Analytics</CardTitle>
              <CardDescription>Select repositories to analyze and compare</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_7_days">Last 7 days</SelectItem>
                  <SelectItem value="last_30_days">Last 30 days</SelectItem>
                  <SelectItem value="last_90_days">Last 90 days</SelectItem>
                  <SelectItem value="full_semester">Full Semester</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {repositories.map((repo) => (
                <Button
                  key={repo.id}
                  variant={selectedRepos.includes(repo.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToggleRepo(repo.id)}
                  className="flex items-center gap-2"
                >
                  <GitBranch className="h-4 w-4" />
                  {repo.name}
                </Button>
              ))}
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add Repository
              </Button>
            </div>

            <div className="flex flex-wrap gap-3 mb-2">
              <Collapsible
                open={showFilters}
                onOpenChange={setShowFilters}
                className="w-full border rounded-md"
              >
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filter Options
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Date Range</h3>
                      <div className="flex items-center gap-2">
                        <Select defaultValue="custom">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="last_week">Last Week</SelectItem>
                            <SelectItem value="last_month">Last Month</SelectItem>
                            <SelectItem value="last_semester">Last Semester</SelectItem>
                            <SelectItem value="custom">Custom Range</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Activity Type</h3>
                      <div className="flex items-center gap-2">
                        <Select defaultValue="all">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select activity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Activities</SelectItem>
                            <SelectItem value="commits">Commits Only</SelectItem>
                            <SelectItem value="issues">Issues Only</SelectItem>
                            <SelectItem value="pull_requests">Pull Requests Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Student Performance</h3>
                      <div className="flex items-center gap-2">
                        <Select defaultValue="all">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select performance" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Students</SelectItem>
                            <SelectItem value="high">High Performers</SelectItem>
                            <SelectItem value="medium">Medium Performers</SelectItem>
                            <SelectItem value="low">Low Performers</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Sort By</h3>
                      <div className="flex items-center gap-2">
                        <Select defaultValue="activity">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select sorting" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="activity">Activity Level</SelectItem>
                            <SelectItem value="recent">Most Recent</SelectItem>
                            <SelectItem value="alphabetical">Alphabetical</SelectItem>
                            <SelectItem value="predicted_grade">Predicted Grade</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button size="sm">Apply Filters</Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible
                open={showComparison}
                onOpenChange={setShowComparison}
                className="w-full border rounded-md"
              >
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ArrowLeftRight className="h-4 w-4" />
                      Repository Comparison
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showComparison ? "rotate-180" : ""}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 border-t">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Compare selected repositories to identify patterns in student performance.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Comparison Metrics</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Select defaultValue="commit_frequency">
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select metric" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="commit_frequency">Commit Frequency</SelectItem>
                                <SelectItem value="code_quality">Code Quality</SelectItem>
                                <SelectItem value="test_coverage">Test Coverage</SelectItem>
                                <SelectItem value="collaboration">Collaboration</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Chart Type</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Select defaultValue="bar">
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select chart type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bar">Bar Chart</SelectItem>
                                <SelectItem value="line">Line Chart</SelectItem>
                                <SelectItem value="radar">Radar Chart</SelectItem>
                                <SelectItem value="scatter">Scatter Plot</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-2">
                      <Button size="sm">Generate Comparison</Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible
                open={showPredictions}
                onOpenChange={setShowPredictions}
                className="w-full border rounded-md"
              >
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Grade Prediction
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs max-w-xs">Predicts final grades based on repository activity patterns and historical data</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showPredictions ? "rotate-180" : ""}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 border-t">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Predict final grades based on current student activity and historical data patterns.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Prediction Model</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Select defaultValue="historical">
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select model" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="historical">Historical Comparison</SelectItem>
                                <SelectItem value="activity">Activity Based</SelectItem>
                                <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                                <SelectItem value="custom">Custom Weights</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Confidence Threshold</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Select defaultValue="medium">
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select confidence" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">High (95%)</SelectItem>
                                <SelectItem value="medium">Medium (80%)</SelectItem>
                                <SelectItem value="low">Low (65%)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-2">
                      <Button size="sm">Generate Predictions</Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
          
          <div className="mt-8">
            {selectedRepos.length > 0 ? (
              <div className="rounded-md bg-muted p-8 h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Repository analytics visualization would appear here</p>
              </div>
            ) : (
              <div className="rounded-md border border-dashed p-8 flex flex-col items-center justify-center text-center">
                <GitBranch className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No Repositories Selected</h3>
                <p className="text-sm text-muted-foreground max-w-md mt-1">
                  Select one or more repositories above to view analytics and comparisons
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <MetricsPanel />
    </div>
  );
}
