
import { useState, useEffect } from "react";
import { SideNav } from "@/components/dashboard/SideNav";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ArrowLeft, Pencil, Trash2, BarChart2 } from "lucide-react";
import { getGroupStudents } from "@/services/repositories/repositoryFetcher";
import { deleteGroup } from "@/services/repositories/repositoryModifier";

export default function GroupDetailsPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (!groupId) return;
      
      try {
        setLoading(true);
        // Fetch group details from supabase
        const { data: groupData, error: groupError } = await fetch('/api/group-details')
          .then(res => res.json());
        
        if (groupError) {
          throw new Error(groupError.message);
        }
        
        // Fetch students in this group
        const studentsData = await getGroupStudents(groupId);
        
        // For now, we'll use placeholder data since we don't have actual data yet
        setGroup({
          id: groupId,
          name: "Grupo 1",
          repositoryId: "sample-repo-id",
          createdAt: new Date().toISOString(),
          studentCount: studentsData.length
        });
        setStudents(studentsData);
      } catch (error) {
        console.error("Error fetching group details:", error);
        toast.error("Failed to load group details");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  const handleDelete = async () => {
    if (!groupId) return;
    
    if (!window.confirm("Are you sure you want to delete this group?")) {
      return;
    }
    
    try {
      setLoading(true);
      const success = await deleteGroup(groupId);
      
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error("Failed to delete group");
    } finally {
      setLoading(false);
    }
  };

  const handlePredict = () => {
    toast.info("Prediction functionality not implemented yet");
  };

  const handleCompare = () => {
    toast.info("Comparison functionality not implemented yet");
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <SideNav />
        <main className="flex-1 p-6">
          <p>Loading group details...</p>
        </main>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <SideNav />
        <main className="flex-1 p-6">
          <p>Group not found.</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SideNav />
      
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-6 px-4">
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold flex items-center">
              {group.name}
              <Button variant="ghost" size="icon" className="ml-2">
                <Pencil className="h-4 w-4" />
              </Button>
            </h1>
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleCompare}
                variant="outline"
              >
                Compare
              </Button>
              <Button 
                onClick={handlePredict}
              >
                Predict
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground mb-4">
            Last Updated: -
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Group Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Group ID</h3>
                  <p className="text-sm">{groupId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Students</h3>
                  <p className="text-sm">{students.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Students</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>GitLab ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">No students in this group</TableCell>
                    </TableRow>
                  ) : (
                    students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.gitlabMemberId}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Activity Metrics
                <Button variant="ghost" size="icon" className="ml-2">
                  <BarChart2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-48 border rounded text-muted-foreground">
                Activity metrics will appear here
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
