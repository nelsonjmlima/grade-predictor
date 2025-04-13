
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { GitLabForm } from "@/components/repository/GitLabForm";
import { StudentIdManager } from "@/components/repository/StudentIdManager";
import { addRepository } from "@/services/repositoryData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SideNav } from "@/components/dashboard/SideNav"; // Import SideNav

export default function AddRepositoryPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"gitlab" | "details">("gitlab");
  
  const [repositoryData, setRepositoryData] = useState({
    projectId: 0,
    projectName: "",
    projectUrl: "",
    members: [] as Array<{
      id: number;
      name: string;
      username: string;
    }>,
  });

  const handleGitLabSuccess = (data: {
    projectId: number;
    projectName: string;
    projectUrl: string;
    members: Array<{
      id: number;
      name: string;
      username: string;
    }>;
  }) => {
    setRepositoryData(data);
    setStep("details");
  };

  const handleStudentsChange = (students: Array<{
    id: number;
    name: string;
    username: string;
  }>) => {
    setRepositoryData({
      ...repositoryData,
      members: students,
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const newRepo = {
        id: `gitlab-${repositoryData.projectId}`,
        name: repositoryData.projectName,
        projectId: repositoryData.projectId.toString(),
        description: `GitLab project #${repositoryData.projectId}`,
        lastActivity: "Just now",
        commitCount: 0,
        mergeRequestCount: 0,
        branchCount: 1,
        progress: 0,
        createdAt: new Date().toISOString(),
        link: repositoryData.projectUrl,
        students: repositoryData.members.map(member => ({
          id: `student-${member.id}`,
          name: member.name,
          email: `${member.username}@gitlab.com`,
          gitlabUsername: member.username,
          commitCount: 0,
          lastActivity: 'Never'
        })),
      };
      
      addRepository(newRepo as any);
      
      toast.success("Repository created successfully", {
        description: `${repositoryData.projectName} has been created and is ready to use.`,
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating repository:", error);
      toast.error("Failed to create repository", {
        description: "An error occurred while creating the repository. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SideNav /> {/* Add SideNav here */}
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full" 
              onClick={() => step === "details" ? setStep("gitlab") : navigate("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-semibold tracking-tight">
              {step === "gitlab" ? "Connect GitLab Repository" : "Configure Repository"}
            </h1>
          </div>
          
          {step === "gitlab" ? (
            <GitLabForm onSuccess={handleGitLabSuccess} />
          ) : (
            <div className="space-y-6">
              <Card className="border shadow-md">
                <CardHeader>
                  <CardTitle>GitLab Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="projectName">Project Name</Label>
                      <Input id="projectName" value={repositoryData.projectName} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projectId">Project ID</Label>
                      <Input id="projectId" value={repositoryData.projectId} readOnly />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectUrl">Project URL</Label>
                    <Input id="projectUrl" value={repositoryData.projectUrl} readOnly />
                  </div>
                </CardContent>
              </Card>
              
              <StudentIdManager 
                initialStudents={repositoryData.members}
                onChange={handleStudentsChange}
              />
              
              <Card>
                <CardFooter className="flex justify-end space-x-4 pt-6">
                  <Button variant="outline" onClick={() => setStep("gitlab")} disabled={isSubmitting}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting || repositoryData.members.length === 0}
                  >
                    {isSubmitting ? "Creating..." : "Create Repository"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

