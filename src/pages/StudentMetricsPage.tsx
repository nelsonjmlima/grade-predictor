
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { SideNav } from "@/components/dashboard/SideNav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart2, Award } from "lucide-react";
import { MetricsPanel } from "@/components/dashboard/MetricsPanel";
import { CommitActivityChart } from "@/components/student/CommitActivityChart";
import { CodeQualityChart } from "@/components/student/CodeQualityChart";
import { FileModificationsChart } from "@/components/student/FileModificationsChart";
import { ContributionTimeline } from "@/components/student/ContributionTimeline";
import { toast } from "sonner";

import { getStudentData } from "@/services/studentData";

export default function StudentMetricsPage() {
  const { id, studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading student data
    const fetchData = async () => {
      try {
        const data = await getStudentData(studentId);
        setStudent(data);
        toast.success("Student metrics loaded successfully");
      } catch (error) {
        toast.error("Error loading student metrics");
        console.error("Error loading student metrics:", error);
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
                <h2 className="text-xl font-medium mb-2">Loading student data...</h2>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!student) {
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
                <h2 className="text-xl font-medium mb-2">Student not found</h2>
                <p className="text-muted-foreground">The requested student data could not be loaded</p>
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
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handleGoBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button asChild className="gap-2">
              <Link to={`/repositories/${id}/student/${studentId}/prediction`}>
                <Award className="h-4 w-4" />
                View Grade Prediction
              </Link>
            </Button>
          </div>

          <div>
            <h1 className="text-2xl font-semibold">{student.name}</h1>
            <p className="text-muted-foreground">{student.email} • Student ID: {student.id}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Commits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{student.commitCount}</p>
                <p className="text-sm text-muted-foreground">
                  {student.commitTrend === "up" ? "▲" : "▼"} 
                  {student.commitPercentChange}% from previous month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Current Grade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{student.currentGrade || 'Not Graded'}</p>
                <p className="text-sm text-muted-foreground">
                  Based on current performance
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Activity Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{student.activityScore}/10</p>
                <p className="text-sm text-muted-foreground">
                  Overall repository activity
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="code-quality">Code Quality</TabsTrigger>
              <TabsTrigger value="metrics">Metrics Selection</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CommitActivityChart commits={student.commits} />
                <FileModificationsChart fileChanges={student.fileChanges} />
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart2 className="h-5 w-5" />
                      Contribution Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-40">
                      <ContributionTimeline contributions={student.contributions} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="code-quality">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CodeQualityChart codeQuality={student.codeQuality} />
                <Card>
                  <CardHeader>
                    <CardTitle>Code Review Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {student.codeReviews?.map((review: any, index: number) => (
                        <div key={index} className="border-b pb-3 last:border-0">
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-medium">{review.title}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              review.type === 'positive' ? 'bg-green-100 text-green-800' : 
                              review.type === 'negative' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {review.type}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{review.message}</p>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>Reviewed by: {review.reviewer}</span>
                            <span>{review.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="metrics">
              <MetricsPanel />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
