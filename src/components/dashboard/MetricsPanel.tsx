
import { useState } from "react";
import { BarChart, LineChart, ChevronDown, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const metricGroups = [
  {
    name: "Commits",
    items: [
      { id: "commit_count", label: "Commit Count", active: true },
      { id: "commit_frequency", label: "Commit Frequency", active: false },
      { id: "commit_message_quality", label: "Commit Message Quality", active: false },
    ],
  },
  {
    name: "Code Quality",
    items: [
      { id: "code_quality_score", label: "Code Quality Score", active: true },
      { id: "test_coverage", label: "Test Coverage", active: false },
      { id: "bug_count", label: "Bug Count", active: false },
    ],
  },
  {
    name: "Collaboration",
    items: [
      { id: "merge_requests", label: "Merge Requests", active: true },
      { id: "code_review_participation", label: "Code Review Participation", active: false },
      { id: "issue_participation", label: "Issue Participation", active: false },
    ],
  },
];

export function MetricsPanel() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("last_30_days");
  const [selectedChartType, setSelectedChartType] = useState("bar");
  const [metrics, setMetrics] = useState(metricGroups);

  const toggleMetric = (groupIndex: number, itemIndex: number) => {
    const newMetrics = [...metrics];
    newMetrics[groupIndex].items[itemIndex].active = !newMetrics[groupIndex].items[itemIndex].active;
    setMetrics(newMetrics);
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Select metrics to include in analysis</CardDescription>
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  {selectedChartType === "bar" ? 
                    <BarChart className="h-4 w-4" /> : 
                    <LineChart className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedChartType("bar")}>
                  <BarChart className="h-4 w-4 mr-2" /> Bar Chart
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedChartType("line")}>
                  <LineChart className="h-4 w-4 mr-2" /> Line Chart
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((group, groupIndex) => (
            <div key={group.name} className="space-y-2">
              <h3 className="font-medium text-sm">{group.name}</h3>
              <div className="grid grid-cols-2 gap-2">
                {group.items.map((item, itemIndex) => (
                  <div key={item.id} className="flex items-start space-x-2">
                    <Checkbox 
                      id={item.id} 
                      checked={item.active}
                      onCheckedChange={() => toggleMetric(groupIndex, itemIndex)}
                      className="mt-1"
                    />
                    <div className="flex items-center">
                      <Label 
                        htmlFor={item.id}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {item.label}
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Information about {item.label.toLowerCase()}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="flex justify-end mt-4">
            <Button className="group">
              Apply Metrics <ChevronDown className="ml-1 h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
