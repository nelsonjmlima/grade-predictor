
import { useState, useEffect } from "react";
import { SideNav } from "@/components/dashboard/SideNav";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { ArrowLeft, Check } from "lucide-react";
import { 
  getRepositories,
  Repository 
} from "@/services/repositoryData";
import { addGroup } from "@/services/repositories/repositoryModifier";
import { RepositoriesList } from "@/components/dashboard/RepositoriesList";

export default function AddGroupPage() {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRepositoryId, setSelectedRepositoryId] = useState<string>('');
  const [step, setStep] = useState<'select-repository' | 'add-group'>('select-repository');
  const [groupName, setGroupName] = useState('');
  
  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setLoading(true);
        const fetchedRepos = await getRepositories();
        setRepositories(fetchedRepos);
      } catch (error) {
        console.error("Error fetching repositories:", error);
        toast.error("Failed to load repositories");
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  const handleRepositorySelect = (repositoryId: string) => {
    setSelectedRepositoryId(repositoryId);
    setStep('add-group');
  };
  
  const createGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }
    
    if (!selectedRepositoryId) {
      toast.error("Please select a repository first");
      return;
    }
    
    try {
      setLoading(true);
      await addGroup(groupName, selectedRepositoryId);
      toast.success("Group created successfully");
      navigate('/dashboard');
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SideNav />
      
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-6">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => {
              if (step === 'add-group') {
                setStep('select-repository');
              } else {
                navigate('/dashboard');
              }
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          {step === 'select-repository' ? (
            <>
              <h1 className="text-2xl font-bold mb-6">Select a Repository</h1>
              {loading ? (
                <p>Loading repositories...</p>
              ) : (
                <RepositoriesList
                  repositories={repositories}
                  viewMode="grid"
                  showGradesTemplate={false}
                  selectedRepository=""
                  programmingStudents={[]}
                  sampleStudents={[]}
                  onRepositorySelect={() => {}}
                  selectButtonText="Select"
                  onSelectButtonClick={(repo) => handleRepositorySelect(repo.id || '')}
                  showSelectButton={true}
                />
              )}
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-6">Set Up Group</h1>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Selected Repository</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        value={repositories.find(r => r.id === selectedRepositoryId)?.name || ''} 
                        disabled 
                      />
                    </div>
                    <div>
                      <Label htmlFor="link">Link</Label>
                      <Input 
                        id="link" 
                        value={repositories.find(r => r.id === selectedRepositoryId)?.link || ''} 
                        disabled 
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input 
                        id="date" 
                        value={new Date().toLocaleDateString()} 
                        disabled 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Group Information</CardTitle>
                  <CardDescription>Please provide the group name</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="groupName">Group Name</Label>
                      <Input 
                        id="groupName" 
                        placeholder="Enter group name" 
                        value={groupName} 
                        onChange={(e) => setGroupName(e.target.value)} 
                      />
                    </div>
                    <Button 
                      className="w-full"
                      onClick={createGroup}
                      disabled={!groupName.trim() || loading}
                    >
                      <Check className="mr-2 h-4 w-4" /> Create Group
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
