
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Repository, RepositoryDB } from "../types/repositoryTypes";
import { parseStudents } from "./dataHelpers";

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
      description: repo.description || "",
      lastActivity: new Date(repo.created_at || new Date()).toISOString(),
      commitCount: 0,
      mergeRequestCount: 0,
      branchCount: 1,
      progress: 0,
      createdAt: repo.created_at,
      link: repo.link,
      students: parseStudents(repo.students || null),
      projectId: repo.project_id,
      userId: repo.user_id,
      // Add default values for properties that might be used by UI components
      apiKey: repo.api_key,
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
    }));
  } catch (error) {
    console.error("Error in getRepositories:", error);
    toast.error("Failed to load repositories");
    return [];
  }
};

export const getRepositoryStudents = async (repositoryId: string) => {
  try {
    const { data, error } = await supabase
      .from("repositories")
      .select("*")
      .eq("id", repositoryId)
      .single();

    if (error) {
      console.error("Error loading repository students:", error);
      return [];
    }
    
    // If the students column doesn't exist, return an empty array
    return parseStudents(data.students || null);
  } catch (error) {
    console.error("Error in getRepositoryStudents:", error);
    return [];
  }
};
