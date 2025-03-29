
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SideNav } from "@/components/dashboard/SideNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, GitBranch, Activity, GitCommit, FileText, Code, Star, Award } from "lucide-react";
import { PredictionModelVisualization } from "@/components/prediction/PredictionModelVisualization";
import { MetricsImportance } from "@/components/prediction/MetricsImportance";
import { PredictionAccuracy } from "@/components/prediction/PredictionAccuracy";
import { PredictionScoreCard } from "@/components/prediction/PredictionScoreCard";
import { getPredictionData } from "@/services/predictionData";
import { toast } from "sonner";

export default function GradePredictionPage() {
  const { id, studentId } = useParams();
  const navigate = useNavigate();
  const [predictionData, setPredictionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading prediction data
    const fetchData = async () => {
      try {
        const data = await getPredictionData(studentId);
        setPredictionData(data);
        toast.success("Prediction data loaded successfully");
      } catch (error) {
        toast.error("Error loading prediction data");
        console.error("Error loading prediction data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <SideNav />
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-center h-[80vh]">
              <div className="text-center">
                <h2 className="text-xl font-medium mb-2">Loading prediction model...</h2>
                <p className="text-muted-foreground mb-4">Please wait while we analyze student data</p>
                <Progress value={65} className="w-[300px] h-2 mb-2" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!predictionData) {
    return (
      <div className="flex h-screen overflow-hidden">
        <SideNav />
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          <div className="max-w-6xl mx-auto space-y-6">
            <Button variant="outline" onClick={handleGoBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center justify-center h-[80vh]">
              <div className="text-center">
                <h2 className="text-xl font-medium mb-2">No prediction data available</h2>
                <p className="text-muted-foreground">Unable to load prediction data for this student</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="max-w-6xl mx-auto space-y-6">
          <Button variant="outline" onClick={handleGoBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold">Grade Prediction for {predictionData.student.name}</h1>
              <p className="text-muted-foreground">
                Course: {predictionData.repository.name} | Student ID: {predictionData.student.id}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Export Report
              </Button>
              <Button variant="outline" className="gap-2">
                <Award className="h-4 w-4" />
                Assign Final Grade
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PredictionScoreCard 
              predictedGrade={predictionData.prediction.grade} 
              confidence={predictionData.prediction.confidence}
              trend={predictionData.prediction.trend}
            />
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <GitCommit className="h-4 w-4" />
                  Commits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{predictionData.metrics.commitCount}</p>
                <p className="text-sm text-muted-foreground">
                  {predictionData.metrics.commitTrend === "up" ? "▲" : "▼"} 
                  {predictionData.metrics.commitPercentChange}% from previous period
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Code Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold">{predictionData.metrics.codeQuality}/10</p>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < Math.floor(predictionData.metrics.codeQuality / 2) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Based on linting and PR reviews</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="model" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="model">Prediction Model</TabsTrigger>
              <TabsTrigger value="metrics">Metrics Importance</TabsTrigger>
              <TabsTrigger value="accuracy">Model Accuracy</TabsTrigger>
              <TabsTrigger value="history">Prediction History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="model">
              <PredictionModelVisualization predictionData={predictionData} />
            </TabsContent>
            
            <TabsContent value="metrics">
              <MetricsImportance metricsImportance={predictionData.metricsImportance} />
            </TabsContent>
            
            <TabsContent value="accuracy">
              <PredictionAccuracy accuracy={predictionData.modelAccuracy} />
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Prediction History</CardTitle>
                  <CardDescription>
                    Previous grade predictions for this student
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {predictionData.predictionHistory.map((prediction: any, index: number) => (
                      <div key={index} className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{prediction.date}</p>
                          <p className="text-sm text-muted-foreground">
                            Predicted Grade: <span className="font-medium">{prediction.grade}</span> with {prediction.confidence}% confidence
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${
                            prediction.change > 0 
                              ? "text-green-600" 
                              : prediction.change < 0 
                              ? "text-red-600" 
                              : ""
                          }`}>
                            {prediction.change > 0 ? "+" : ""}{prediction.change}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Change from previous
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
