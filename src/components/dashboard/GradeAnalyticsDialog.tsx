
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Clock, Save, Download, BarChart as BarChartIcon, LineChart as LineChartIcon, Calendar } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";

interface GradeAnalyticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repositoryName: string;
}

// Sample prediction history data
const predictionHistoryData = [
  { 
    id: "pred1", 
    date: "2023-09-15", 
    label: "Early Semester", 
    predictions: [
      { studentName: "Ines Silva", predictedGrade: "B+", actualGrade: "A-" },
      { studentName: "Carolina Pereira", predictedGrade: "C+", actualGrade: "B+" },
      { studentName: "Bruna Costa", predictedGrade: "A-", actualGrade: "A" },
      { studentName: "Luis Santos", predictedGrade: "D", actualGrade: "C+" },
      { studentName: "Nelson Oliveira", predictedGrade: "B-", actualGrade: "B" },
    ]
  },
  { 
    id: "pred2", 
    date: "2023-10-30", 
    label: "Mid Semester", 
    predictions: [
      { studentName: "Ines Silva", predictedGrade: "A-", actualGrade: "A-" },
      { studentName: "Carolina Pereira", predictedGrade: "B", actualGrade: "B+" },
      { studentName: "Bruna Costa", predictedGrade: "A", actualGrade: "A" },
      { studentName: "Luis Santos", predictedGrade: "C", actualGrade: "C+" },
      { studentName: "Nelson Oliveira", predictedGrade: "B", actualGrade: "B" },
    ]
  },
  { 
    id: "pred3", 
    date: "2023-12-01", 
    label: "Late Semester", 
    predictions: [
      { studentName: "Ines Silva", predictedGrade: "A-", actualGrade: "A-" },
      { studentName: "Carolina Pereira", predictedGrade: "B+", actualGrade: "B+" },
      { studentName: "Bruna Costa", predictedGrade: "A", actualGrade: "A" },
      { studentName: "Luis Santos", predictedGrade: "C+", actualGrade: "C+" },
      { studentName: "Nelson Oliveira", predictedGrade: "B", actualGrade: "B" },
    ]
  }
];

// Convert letter grades to numerical values for charting
const gradeToNumber = (grade: string) => {
  const gradeMap: Record<string, number> = {
    "A+": 4.3, "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7,
    "D+": 1.3, "D": 1.0, "D-": 0.7,
    "F": 0.0
  };
  return gradeMap[grade] || 0;
};

// Performance metrics data
const performanceMetrics = [
  { name: "Code Quality", value: 78, previous: 65 },
  { name: "Test Coverage", value: 62, previous: 48 },
  { name: "Git Collaboration", value: 85, previous: 80 },
  { name: "Documentation", value: 70, previous: 55 },
  { name: "Problem Solving", value: 82, previous: 75 },
  { name: "Algorithm Efficiency", value: 75, previous: 60 },
];

export function GradeAnalyticsDialog({ open, onOpenChange, repositoryName }: GradeAnalyticsDialogProps) {
  const [selectedStudent, setSelectedStudent] = useState<string>("Ines Silva");
  const [selectedPredictions, setSelectedPredictions] = useState<string[]>(["pred2", "pred3"]);
  const [viewMode, setViewMode] = useState<"individual" | "comparative">("individual");
  
  // Prepare data for the student progress chart
  const studentProgressData = predictionHistoryData.map(prediction => {
    const studentPrediction = prediction.predictions.find(p => p.studentName === selectedStudent);
    return {
      date: prediction.date,
      label: prediction.label,
      predicted: gradeToNumber(studentPrediction?.predictedGrade || "F"),
      actual: gradeToNumber(studentPrediction?.actualGrade || "F"),
      predictedGrade: studentPrediction?.predictedGrade || "F",
      actualGrade: studentPrediction?.actualGrade || "F",
    };
  });
  
  // Prepare data for prediction comparison
  const comparisonData = predictionHistoryData
    .filter(pred => selectedPredictions.includes(pred.id))
    .map(prediction => {
      const result: any = { name: prediction.label };
      prediction.predictions.forEach(p => {
        result[p.studentName] = gradeToNumber(p.predictedGrade);
      });
      return result;
    });
  
  // Generate current prediction data (simulated)
  const currentPrediction = {
    date: new Date().toISOString().split("T")[0],
    label: "Current Prediction",
    predictions: [
      { studentName: "Ines Silva", predictedGrade: "A", actualGrade: "?" },
      { studentName: "Carolina Pereira", predictedGrade: "B+", actualGrade: "?" },
      { studentName: "Bruna Costa", predictedGrade: "A+", actualGrade: "?" },
      { studentName: "Luis Santos", predictedGrade: "C+", actualGrade: "?" },
      { studentName: "Nelson Oliveira", predictedGrade: "B+", actualGrade: "?" },
    ]
  };
  
  // Function to save current prediction
  const saveCurrentPrediction = () => {
    // In a real app, this would save to a database
    console.log("Saving current prediction:", currentPrediction);
    // Show a toast notification
    alert("Prediction saved successfully!");
  };
  
  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Grade Analytics - {repositoryName}</DialogTitle>
            <DialogDescription>
              Predict and track student grades over time
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="predictions" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="predictions" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {predictionHistoryData[0].predictions.map(p => (
                        <SelectItem key={p.studentName} value={p.studentName}>
                          {p.studentName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select defaultValue="semester">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semester">Full Semester</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                      <SelectItem value="week">Last Week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={saveCurrentPrediction}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Current
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
              
              <Card className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{selectedStudent} - Grade Prediction</h3>
                    <p className="text-sm text-muted-foreground">Prediction history and accuracy</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-primary rounded-full mr-2" />
                      <span className="text-xs">Predicted</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#10B981] rounded-full mr-2" />
                      <span className="text-xs">Actual</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={studentProgressData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                      <XAxis dataKey="label" />
                      <YAxis
                        domain={[0, 4.5]}
                        ticks={[0, 1, 2, 3, 4]}
                        tickFormatter={(value) => {
                          const gradeMap: Record<number, string> = {
                            0: "F", 1: "D", 2: "C", 3: "B", 4: "A"
                          };
                          return gradeMap[value] || "";
                        }}
                      />
                      <Tooltip
                        formatter={(value, name) => {
                          const gradeValue = Number(value);
                          const gradeMap: Record<number, string> = {
                            4.3: "A+", 4: "A", 3.7: "A-",
                            3.3: "B+", 3: "B", 2.7: "B-",
                            2.3: "C+", 2: "C", 1.7: "C-",
                            1.3: "D+", 1: "D", 0.7: "D-",
                            0: "F"
                          };
                          // Find closest grade
                          const grades = Object.keys(gradeMap).map(Number);
                          const closestGrade = grades.reduce((prev, curr) => {
                            return Math.abs(curr - gradeValue) < Math.abs(prev - gradeValue) ? curr : prev;
                          });
                          return [gradeMap[closestGrade], name === "predicted" ? "Predicted Grade" : "Actual Grade"];
                        }}
                        labelFormatter={(label) => `Prediction: ${label}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="predicted"
                        stroke="#6366F1"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Predicted"
                      />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Actual"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="rounded-md bg-muted p-3">
                    <div className="text-xs text-muted-foreground mb-1">Current Prediction</div>
                    <div className="text-lg font-semibold">
                      {currentPrediction.predictions.find(p => p.studentName === selectedStudent)?.predictedGrade || "N/A"}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" /> Updated today
                    </div>
                  </div>
                  
                  <div className="rounded-md bg-muted p-3">
                    <div className="text-xs text-muted-foreground mb-1">Prediction Accuracy</div>
                    <div className="text-lg font-semibold">92%</div>
                    <div className="text-xs text-muted-foreground flex items-center mt-1">
                      <Calendar className="h-3 w-3 mr-1" /> Based on history
                    </div>
                  </div>
                  
                  <div className="rounded-md bg-muted p-3">
                    <div className="text-xs text-muted-foreground mb-1">Grade Trend</div>
                    <div className="text-lg font-semibold text-green-500">Improving</div>
                    <div className="text-xs text-muted-foreground flex items-center mt-1">
                      <LineChartIcon className="h-3 w-3 mr-1" /> +0.3 grade points
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="comparison" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Prediction Comparison</h3>
                  <p className="text-sm text-muted-foreground">Compare predictions across different time periods</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant={viewMode === "individual" ? "default" : "outline"}
                    onClick={() => setViewMode("individual")}
                  >
                    Individual
                  </Button>
                  <Button 
                    size="sm" 
                    variant={viewMode === "comparative" ? "default" : "outline"}
                    onClick={() => setViewMode("comparative")}
                  >
                    Comparative
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {predictionHistoryData.map(pred => (
                  <Button
                    key={pred.id}
                    size="sm"
                    variant={selectedPredictions.includes(pred.id) ? "default" : "outline"}
                    onClick={() => {
                      if (selectedPredictions.includes(pred.id)) {
                        setSelectedPredictions(selectedPredictions.filter(id => id !== pred.id));
                      } else {
                        setSelectedPredictions([...selectedPredictions, pred.id]);
                      }
                    }}
                  >
                    {pred.label}
                  </Button>
                ))}
              </div>
              
              <Card className="p-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {viewMode === "individual" ? (
                      <BarChart
                        data={comparisonData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                        <XAxis dataKey="name" />
                        <YAxis
                          domain={[0, 4.5]}
                          ticks={[0, 1, 2, 3, 4]}
                          tickFormatter={(value) => {
                            const gradeMap: Record<number, string> = {
                              0: "F", 1: "D", 2: "C", 3: "B", 4: "A"
                            };
                            return gradeMap[value] || "";
                          }}
                        />
                        <Tooltip />
                        <Legend />
                        {predictionHistoryData[0].predictions.map((student, index) => (
                          <Bar 
                            key={student.studentName}
                            dataKey={student.studentName} 
                            fill={`hsl(${index * 60}, 70%, 60%)`}
                          />
                        ))}
                      </BarChart>
                    ) : (
                      <LineChart
                        data={studentProgressData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                        <XAxis dataKey="label" />
                        <YAxis
                          domain={[0, 4.5]}
                          ticks={[0, 1, 2, 3, 4]}
                          tickFormatter={(value) => {
                            const gradeMap: Record<number, string> = {
                              0: "F", 1: "D", 2: "C", 3: "B", 4: "A"
                            };
                            return gradeMap[value] || "";
                          }}
                        />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="predicted"
                          stroke="#6366F1"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                          name="Predicted"
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="metrics" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Performance Metrics</h3>
                  <p className="text-sm text-muted-foreground">Detailed performance factors affecting grade prediction</p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Metrics
                </Button>
              </div>
              
              <Card className="p-4">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={performanceMetrics}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.2} />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" width={120} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, "Score"]} 
                      />
                      <Legend />
                      <Bar 
                        dataKey="previous" 
                        fill="#94A3B8" 
                        name="Previous Assessment"
                        radius={[0, 0, 0, 0]}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="#6366F1" 
                        name="Current Assessment"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-md bg-muted p-3">
                    <div className="text-xs text-muted-foreground mb-1">Overall Performance</div>
                    <div className="text-lg font-semibold">75/100</div>
                    <div className="text-xs text-green-500 flex items-center mt-1">
                      <LineChartIcon className="h-3 w-3 mr-1" /> +12 from last assessment
                    </div>
                  </div>
                  <div className="rounded-md bg-muted p-3">
                    <div className="text-xs text-muted-foreground mb-1">Top Strength</div>
                    <div className="text-lg font-semibold">Git Collaboration</div>
                    <div className="text-xs text-muted-foreground mt-1">85% performance score</div>
                  </div>
                  <div className="rounded-md bg-muted p-3">
                    <div className="text-xs text-muted-foreground mb-1">Area for Improvement</div>
                    <div className="text-lg font-semibold">Test Coverage</div>
                    <div className="text-xs text-muted-foreground mt-1">62% performance score</div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="flex justify-between">
            <div className="text-xs text-muted-foreground">
              Last prediction: {new Date().toLocaleDateString()}
            </div>
            <Button type="submit" onClick={() => onOpenChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
