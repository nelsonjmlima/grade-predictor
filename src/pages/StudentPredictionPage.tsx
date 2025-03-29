
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SideNav } from "@/components/dashboard/SideNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calculator, GitCommit, FileCode, Clock, BarChart3, Award, ChevronRight } from "lucide-react";
import { PredictionCalculationCard } from "@/components/student/PredictionCalculationCard";
import { PredictionAccuracyChart } from "@/components/student/PredictionAccuracyChart";
import { GradeComparisonChart } from "@/components/student/GradeComparisonChart";
import { generatePredictionData } from "@/services/studentPredictionData";

export default function StudentPredictionPage() {
  const { id, studentId } = useParams();
  const navigate = useNavigate();
  const [predictionData, setPredictionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    if (id && studentId) {
      // Generate sample data instead of fetching from API
      const data = generatePredictionData(id, studentId);
      setPredictionData(data);
      setLoading(false);
    }
  }, [id, studentId]);

  const handleGoBack = () => {
    navigate(`/repositories/${id}/student/${studentId}`);
  };

  // Start the calculation animation sequence
  const startAnimation = () => {
    setAnimationStarted(true);
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <SideNav />
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          <div className="max-w-6xl mx-auto space-y-6 flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin-slow inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
              <p className="text-muted-foreground">Loading prediction data...</p>
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
            Back to Student Metrics
          </Button>
          
          {predictionData && (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-semibold">Grade Prediction for {predictionData.studentName}</h1>
                  <p className="text-muted-foreground">Course: {predictionData.repositoryName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Export Report
                  </Button>
                </div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-medium flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Predicted Final Grade
                    </CardTitle>
                    <CardDescription>
                      Based on GitLab activity and performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row items-center justify-between p-6">
                      <div className="text-center mb-4 md:mb-0">
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.7, delay: 0.3 }}
                          className="relative"
                        >
                          <div className={`text-6xl font-bold ${predictionData.predictedGrade.score >= 85 ? 'text-green-500' : predictionData.predictedGrade.score >= 70 ? 'text-amber-500' : 'text-red-500'}`}>
                            {predictionData.predictedGrade.letter}
                          </div>
                          <div className="text-lg text-muted-foreground mt-2">
                            {predictionData.predictedGrade.score}%
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Confidence: {predictionData.confidenceLevel}%
                          </div>
                        </motion.div>
                      </div>
                      
                      <div className="bg-muted p-6 rounded-lg w-full md:w-3/5">
                        <h3 className="text-lg font-medium mb-4">Prediction Summary</h3>
                        <div className="space-y-3">
                          {predictionData.summary.map((item: any, index: number) => (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                              className="flex items-start gap-2"
                            >
                              <ChevronRight className="h-4 w-4 mt-1 text-primary shrink-0" />
                              <p className="text-sm">{item}</p>
                            </motion.div>
                          ))}
                        </div>
                        
                        {!animationStarted && (
                          <div className="mt-6">
                            <Button onClick={startAnimation} className="w-full">
                              <Calculator className="h-4 w-4 mr-2" />
                              Show Calculation Process
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {animationStarted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold">Prediction Model Calculation</h2>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {predictionData.factors.map((factor: any, index: number) => (
                      <PredictionCalculationCard 
                        key={index}
                        index={index}
                        factor={factor}
                      />
                    ))}
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 1.8 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg font-medium flex items-center gap-2">
                            <Calculator className="h-5 w-5 text-primary" />
                            Final Grade Calculation
                          </CardTitle>
                          <CardDescription>
                            The weighted combination of all factors
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="p-4 bg-muted/50 rounded-lg font-mono text-sm">
                            <div className="mb-4">
                              {predictionData.factors.map((factor: any, index: number) => (
                                <motion.div 
                                  key={index}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.5, delay: 2 + index * 0.2 }}
                                  className="mb-2"
                                >
                                  <span className="text-muted-foreground">{factor.name} Score</span>: {factor.normalizedScore} × {factor.weight} = <span className="font-medium">{(factor.normalizedScore * factor.weight).toFixed(2)}</span>
                                </motion.div>
                              ))}
                            </div>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5, delay: 3 }}
                              className="border-t border-border pt-4"
                            >
                              <span className="text-muted-foreground">Total Score</span>: <span className="font-bold">{predictionData.predictedGrade.score}%</span> = <span className="font-bold text-lg">{predictionData.predictedGrade.letter}</span>
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </motion.div>
              )}
              
              <Tabs defaultValue="accuracy" className="w-full mt-6">
                <TabsList className="mb-4">
                  <TabsTrigger value="accuracy">Prediction Accuracy</TabsTrigger>
                  <TabsTrigger value="comparison">Grade Comparison</TabsTrigger>
                </TabsList>
                
                <TabsContent value="accuracy">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Model Accuracy History</CardTitle>
                      <CardDescription>
                        How accurate our predictions have been for similar students
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <PredictionAccuracyChart data={predictionData.accuracyData} />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="comparison">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Student Comparison</CardTitle>
                      <CardDescription>
                        How this student compares to others in the same cohort
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <GradeComparisonChart data={predictionData.comparisonData} />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
