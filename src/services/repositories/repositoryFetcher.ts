
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Repository, RepositoryDB } from "../types/repositoryTypes";

export const getRepositories = async (): Promise<Repository[]> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    console.log("Getting repositories for user ID:", userId);
    
    let query = supabase.from("repositories").select("*");
    
    if (userId) {
      query = query.eq("user_id", userId);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error loading repositories:", error);
      toast.error("Failed to load repositories");
      return [];
    }
    
    console.log("Fetched repositories from Supabase:", data);
    
    // Map the database fields to our Repository interface, providing default values for missing fields
    return (data || []).map((repo: RepositoryDB) => ({
      id: repo.id,
      name: repo.name,
      description: "", // Default value for description
      lastActivity: repo.created_at || new Date().toISOString(),
      commitCount: 0, // Default value
      mergeRequestCount: 0, // Default value
      branchCount: 1, // Default value
      progress: 0, // Default value
      createdAt: repo.created_at,
      link: repo.link,
      students: [], // Since students are now in a separate table
      projectId: repo.project_id,
      userId: repo.user_id,
      // Add default values for properties that might be used by UI components
      author: "",
      email: "",
      date: repo.created_at || new Date().toISOString(),
      additions: 0,
      deletions: 0,
      operations: 0,
      totalAdditions: 0,
      totalDeletions: 0,
      totalOperations: 0,
      averageOperationsPerCommit: 0,
      averageCommitsPerWeek: 0,
      language: "",
      technologies: [],
      predictedGrade: "",
      gitlabUser: "",
      weekOfPrediction: "",
      finalGradePrediction: "",
      csvFileUrl: "",
      apiKey: "", // Default value for API key
    }));
  } catch (error) {
    console.error("Error in getRepositories:", error);
    toast.error("Failed to load repositories");
    return [];
  }
};

export const getRepositoryStudents = async (repositoryId: string) => {
  try {
    // Now students are in a separate table
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("repository_id", repositoryId);

    if (error) {
      console.error("Error loading repository students:", error);
      return [];
    }
    
    // Map the students from the database to our Student model
    return data.map(student => ({
      id: student.id,
      name: student.name,
      email: student.email,
      gitlabUsername: student.gitlab_username,
      gitlabMemberId: student.gitlab_member_id,
      commitCount: 0,
      lastActivity: new Date().toISOString()
    }));
  } catch (error) {
    console.error("Error in getRepositoryStudents:", error);
    return [];
  }
};
