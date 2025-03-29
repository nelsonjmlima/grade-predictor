
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { SideNav } from "@/components/dashboard/SideNav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, GitCommit, FileText, Clock, Activity, BarChart2, Award } from "lucide-react";
import { motion } from "framer-motion";

// Components
import { CommitActivityChart } from "@/components/student/CommitActivityChart";
import { CodeQualityChart } from "@/components/student/CodeQualityChart";
import { FileModificationsChart } from "@/components/student/FileModificationsChart";
import { ContributionTimeline } from "@/components/student/ContributionTimeline";

// Data
import { getStudentData } from "@/services/studentData";

export default function StudentMetricsPage() {
  const { id, studentId } = useParams();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && studentId) {
      // Fetch student data
      const data = getStudentData(id, studentId);
      setStudentData(data);
      setLoading(false);
    }
  }, [id, studentId]);

  const handleGoBack = () => {
    navigate(`/repositories/${id}`);
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <SideNav />
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          <div className="max-w-6xl mx-auto h-full flex items-center justify-center">
            <div className="text-center animate-pulse">
              <div className="h-8 w-8 mx-auto mb-4 rounded-full border-4 border-t-transparent border-primary animate-spin"></div>
              <p className="text-muted-foreground">Loading student data...</p>
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
            Back to Repository
          </Button>
          
          {studentData && (
            <>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-semibold">{studentData.name}</h1>
                  <p className="text-muted-foreground">Repository: {studentData.repositoryName}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Export Report
                  </Button>
                  <Button as={Link} to={`/repositories/${id}/student/${studentId}/prediction`} className="gap-2">
                    <Award className="h-4 w-4" />
                    View Grade Prediction
                  </Button>
                </div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-on-scroll"
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <GitCommit className="h-4 w-4 text-primary" />
                      Total Commits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{studentData.totalCommits}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Last Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{studentData.lastActivity}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <BarChart2 className="h-4 w-4 text-primary" />
                      Current Grade
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{studentData.currentGrade || 'Not graded'}</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <Tabs defaultValue="activity" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="files">Files</TabsTrigger>
                  <TabsTrigger value="quality">Code Quality</TabsTrigger>
                </TabsList>
                
                <TabsContent value="activity">
                  <div className="grid grid-cols-1 gap-6">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xl">Commit Activity</CardTitle>
                          <CardDescription>
                            Commits by day of week and time
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-80">
                            <CommitActivityChart data={studentData.commitActivity} />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xl">Contribution Timeline</CardTitle>
                          <CardDescription>
                            Activity over time
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-40">
                            <ContributionTimeline data={studentData.contributionTimeline} />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </TabsContent>
                
                <TabsContent value="files">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl">File Modifications</CardTitle>
                        <CardDescription>
                          Files changed over time
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <FileModificationsChart data={studentData.fileModifications} />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="quality">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl">Code Quality Metrics</CardTitle>
                        <CardDescription>
                          Code quality over time
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <CodeQualityChart data={studentData.codeQuality} />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
