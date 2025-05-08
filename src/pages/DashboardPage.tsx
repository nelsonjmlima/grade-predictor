
import { useState, useEffect, useCallback } from "react";
import { SideNav } from "@/components/dashboard/SideNav";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus, PenSquare, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getGroups } from "@/services/repositories/repositoryFetcher";

export default function DashboardPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching groups for user:", user?.id);
      if (!user) {
        console.log("No authenticated user found");
        setGroups([]);
        return;
      }
      
      const fetchedGroups = await getGroups();
      console.log("Fetched groups:", fetchedGroups);
      setGroups(fetchedGroups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error("Failed to load groups");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchGroups();
    
    // Refresh groups when window gets focus (in case groups were added elsewhere)
    window.addEventListener('focus', fetchGroups);
    
    return () => {
      window.removeEventListener('focus', fetchGroups);
    };
  }, [fetchGroups]);

  const handleGroupClick = (groupId: string) => {
    navigate(`/groups/${groupId}`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SideNav />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex flex-col mb-4">
            <h1 className="font-semibold tracking-tight text-2xl">Dashboard</h1>
            <p className="text-muted-foreground font-normal text-base">Manage your groups</p>
            <p className="text-base text-primary mt-1 font-semibold">
              {user ? `Welcome ${user.email?.split('@')[0]}` : "Welcome"}
            </p>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              {groups.length > 0 ? `Managing ${groups.length} groups.` : ""}
            </p>
            
            <Button 
              onClick={() => navigate('/groups/add')} 
              className="flex items-center"
              variant="default"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Group
            </Button>
          </div>
          
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full p-8 text-center">
                <p className="text-muted-foreground">
                  Loading groups...
                </p>
              </div>
            ) : groups.length > 0 ? groups.map(group => (
              <div 
                key={group.id} 
                className="cursor-pointer transform transition-transform hover:scale-[1.01]" 
                onClick={() => handleGroupClick(group.id)}
              >
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="font-medium text-base flex items-center justify-between">
                      <span className="truncate mr-2">{group.name}</span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pb-3">
                    <p className="text-sm mb-2">
                      Number of students: {group.studentCount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created On: {new Date(group.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )) : (
              <div className="col-span-full p-8 text-center">
                <p className="text-muted-foreground">
                  No groups found. Click the "Add Group" button to add your first group.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
