
import { useState } from "react";
import { 
  ArrowUp, 
  ArrowDown,
  BarChart,
  ChartLine,
  ChartPie,
  Database,
  FileText,
  Search
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const courseRepositories = [
  { id: "cs101", name: "CS101: Introduction to Programming" },
  { id: "ds202", name: "DS202: Data Structures" },
  { id: "algo303", name: "ALGO303: Algorithm Design" },
  { id: "web404", name: "WEB404: Web Development" },
];

export function GradePredictionPanel() {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [confidence, setConfidence] = useState<string>("medium");
  const [predictionModel, setPredictionModel] = useState<string>("comprehensive");
  const [predictionGenerated, setPredictionGenerated] = useState<boolean>(false);
  const [loadingPrediction, setLoadingPrediction] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("model");
  
  const handleGeneratePrediction = () => {
    if (!selectedCourse) {
      toast.error("Please select a course to generate predictions");
      return;
    }
    
    setLoadingPrediction(true);
    
    // Simulate loading delay
    setTimeout(() => {
      setLoadingPrediction(false);
      setPredictionGenerated(true);
      toast.success("Grade predictions generated successfully");
    }, 2000);
  };
  
  const renderEmptyState = () => (
    <div className="rounded-md border border-dashed p-8 flex flex-col items-center justify-center text-center">
      <Database className="h-10 w-10 text-muted-foreground mb-2" />
      <h3 className="text-lg font-medium">No Course Selected</h3>
      <p className="text-sm text-muted-foreground max-w-md mt-1">
        Select a course from the dropdown above to generate grade predictions for students
      </p>
    </div>
  );
  
  const renderLoadingState = () => (
    <div className="p-8 flex flex-col items-center justify-center text-center">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
      </div>
      <h3 className="text-lg font-medium mb-2">Generating Predictions</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        Our model is analyzing student activity patterns and generating predictions...
      </p>
      <Progress value={65} className="w-[300px] h-2" />
    </div>
  );
  
  const renderPredictionResults = () => (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full animate-fade-in">
      <TabsList className="mb-4">
        <TabsTrigger value="model">
          <ChartLine className="h-4 w-4 mr-2" />
          Model Output
        </TabsTrigger>
        <TabsTrigger value="statistics">
          <BarChart className="h-4 w-4 mr-2" />
          Grade Distribution
        </TabsTrigger>
        <TabsTrigger value="factors">
          <ChartPie className="h-4 w-4 mr-2" />
          Influencing Factors
        </TabsTrigger>
        <TabsTrigger value="export">
          <FileText className="h-4 w-4 mr-2" />
          Export Options
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="model" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Grade Prediction Model Results</CardTitle>
            <CardDescription>
              Overall grade distribution prediction for {courseRepositories.find(c => c.id === selectedCourse)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {["A", "B", "C", "D"].map((grade, index) => {
                // Simulated prediction values
                const percentage = [28, 42, 20, 10][index];
                const trend = ["up", "up", "down", "down"][index];
                
                return (
                  <Card key={grade} className="animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-2xl font-bold">{grade}</CardTitle>
                        <div className="flex items-center">
                          {trend === "up" ? (
                            <ArrowUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-red-500" />
                          )}
                          <span className={`text-xs font-medium ${
                            trend === "up" ? "text-green-500" : "text-red-500"
                          }`}>
                            {trend === "up" ? "+3%" : "-2%"}
                          </span>
                        </div>
                      </div>
                      <CardDescription>Predicted Distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{percentage}%</span>
                          <span className="text-muted-foreground">{Math.round(percentage * 0.75)}% last year</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="mt-8 p-6 bg-muted/20 rounded-md border">
              <h3 className="text-lg font-medium mb-3">Student Success Predictions</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Likely to succeed (A/B)</span>
                  <span className="text-sm font-medium">{70}%</span>
                </div>
                <Progress value={70} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">At risk (C)</span>
                  <span className="text-sm font-medium">{20}%</span>
                </div>
                <Progress value={20} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Intervention needed (D/F)</span>
                  <span className="text-sm font-medium">{10}%</span>
                </div>
                <Progress value={10} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Confidence</CardTitle>
              <CardDescription>
                How confident is the model in its predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="relative w-36 h-36">
                  <div className="absolute inset-0 rounded-full bg-muted"></div>
                  <div 
                    className="absolute inset-0 rounded-full bg-primary transition-all duration-1000"
                    style={{ 
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin(2 * Math.PI * 86 / 100)}% ${50 - 50 * Math.cos(2 * Math.PI * 86 / 100)}%, 50% 50%)`
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-3xl font-bold">86%</div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center mt-4">
                The model is highly confident in these predictions based on historical data patterns
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Prediction Timeline</CardTitle>
              <CardDescription>
                When predictions were generated and updated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: "Today", label: "Latest prediction" },
                  { date: "1 week ago", label: "Previous prediction" },
                  { date: "1 month ago", label: "Initial prediction" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.date}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-sm font-medium">
                        {index === 0 ? "86%" : index === 1 ? "82%" : "75%"}
                      </div>
                      <div className="text-xs text-muted-foreground">confidence</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="statistics">
        <Card>
          <CardHeader>
            <CardTitle>Predicted Grade Distribution</CardTitle>
            <CardDescription>
              Comparison of predicted grades against historical data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] bg-muted/20 rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Grade distribution visualization would appear here</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="factors">
        <Card>
          <CardHeader>
            <CardTitle>Key Influencing Factors</CardTitle>
            <CardDescription>
              Metrics that most strongly influence the grade predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: "Commit Frequency", value: 85, description: "Regular code commits indicate consistent work" },
                { name: "Code Quality", value: 72, description: "Measured through linting and complexity analysis" },
                { name: "Assignment Completion", value: 92, description: "Percentage of assignments completed on time" },
                { name: "Collaboration", value: 64, description: "Engagement with peers through PRs and comments" },
                { name: "Test Coverage", value: 58, description: "Percentage of code covered by tests" }
              ].map((factor, index) => (
                <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{factor.name}</span>
                    <span className="text-sm font-medium">{factor.value}%</span>
                  </div>
                  <Progress value={factor.value} className="h-2 mb-1" />
                  <p className="text-xs text-muted-foreground">{factor.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="export">
        <Card>
          <CardHeader>
            <CardTitle>Export Prediction Data</CardTitle>
            <CardDescription>
              Export predictions in various formats for further analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="w-full py-8 h-auto flex flex-col items-center justify-center gap-2">
                <FileText className="h-6 w-6 mb-2" />
                <span>PDF Report</span>
                <span className="text-xs text-muted-foreground">Complete prediction analysis</span>
              </Button>
              <Button variant="outline" className="w-full py-8 h-auto flex flex-col items-center justify-center gap-2">
                <Database className="h-6 w-6 mb-2" />
                <span>CSV Data</span>
                <span className="text-xs text-muted-foreground">Raw prediction data</span>
              </Button>
              <Button variant="outline" className="w-full py-8 h-auto flex flex-col items-center justify-center gap-2">
                <ChartLine className="h-6 w-6 mb-2" />
                <span>API Access</span>
                <span className="text-xs text-muted-foreground">For integration with other systems</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <CardTitle>Grade Prediction Model</CardTitle>
              <CardDescription>
                Predict student grades based on repository activity and historical data patterns
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-full sm:w-[240px]">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courseRepositories.map((repo) => (
                    <SelectItem key={repo.id} value={repo.id}>
                      {repo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                className="gap-2"
                disabled={!selectedCourse || loadingPrediction}
                onClick={handleGeneratePrediction}
              >
                <Search className="h-4 w-4" />
                Generate Predictions
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Prediction Model</h3>
                <Select value={predictionModel} onValueChange={setPredictionModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                    <SelectItem value="activity">Activity-Based</SelectItem>
                    <SelectItem value="historical">Historical Comparison</SelectItem>
                    <SelectItem value="custom">Custom Weights</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Confidence Threshold</h3>
                <Select value={confidence} onValueChange={setConfidence}>
                  <SelectTrigger>
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
            
            <div className="mt-6">
              {!selectedCourse || (!loadingPrediction && !predictionGenerated) ? (
                renderEmptyState()
              ) : loadingPrediction ? (
                renderLoadingState()
              ) : (
                renderPredictionResults()
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
