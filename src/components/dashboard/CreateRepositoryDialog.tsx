
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { addRepository } from "@/services/repositoryData";
import { GitLabForm } from "@/components/repository/GitLabForm";
import { StudentIdManager } from "@/components/repository/StudentIdManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Using Label instead of FormItem/FormLabel

interface CreateRepositoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRepositoryCreated?: () => void;
}

export function CreateRepositoryDialog({ 
  open, 
  onOpenChange, 
  onRepositoryCreated 
}: CreateRepositoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"gitlab" | "details">("gitlab");
  const navigate = useNavigate();
  
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

  const handleDialogClose = () => {
    // Reset form state when dialog is closed
    setStep("gitlab");
    setRepositoryData({
      projectId: 0,
      projectName: "",
      projectUrl: "",
      members: [],
    });
    onOpenChange(false);
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
      
      setIsSubmitting(false);
      handleDialogClose();
      
      if (onRepositoryCreated) {
        onRepositoryCreated();
      }
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating repository:", error);
      toast.error("Failed to create repository", {
        description: "An error occurred while creating the repository. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "gitlab" ? "Connect GitLab Repository" : "Configure Repository"}
          </DialogTitle>
          <DialogDescription>
            {step === "gitlab" 
              ? "Connect to your GitLab repository to track student progress and performance."
              : "Configure your repository settings and add student information."
            }
          </DialogDescription>
        </DialogHeader>

        {step === "gitlab" ? (
          <GitLabForm onSuccess={handleGitLabSuccess} />
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">GitLab Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dialog-projectName">Project Name</Label>
                    <Input id="dialog-projectName" value={repositoryData.projectName} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dialog-projectId">Project ID</Label>
                    <Input id="dialog-projectId" value={repositoryData.projectId} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dialog-projectUrl">Project URL</Label>
                  <Input id="dialog-projectUrl" value={repositoryData.projectUrl} readOnly />
                </div>
              </CardContent>
            </Card>
            
            <StudentIdManager 
              initialStudents={repositoryData.members}
              onChange={handleStudentsChange}
            />
            
            <div className="flex justify-end space-x-4 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setStep("gitlab")}
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || repositoryData.members.length === 0}
              >
                {isSubmitting ? "Creating..." : "Create Repository"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
