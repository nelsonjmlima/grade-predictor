
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Repository } from "../types/repositoryTypes";
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
    
    return (data || []).map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      lastActivity: repo.last_activity || new Date().toISOString(),
      commitCount: repo.commit_count || 0,
      mergeRequestCount: repo.merge_request_count || 0,
      branchCount: repo.branch_count || 1,
      progress: repo.progress || 0,
      createdAt: repo.created_at,
      link: repo.link,
      students: parseStudents(repo.students),
      projectId: repo.project_id,
      author: repo.author,
      email: repo.email,
      date: repo.date,
      additions: repo.additions,
      deletions: repo.deletions,
      operations: repo.operations,
      totalAdditions: repo.total_additions,
      totalDeletions: repo.total_deletions,
      totalOperations: repo.total_operations,
      averageOperationsPerCommit: repo.average_operations_per_commit,
      averageCommitsPerWeek: repo.average_commits_per_week,
      language: repo.language,
      technologies: repo.technologies,
      predictedGrade: repo.predicted_grade,
      userId: repo.user_id,
      gitlabUser: repo.gitlab_user,
      weekOfPrediction: repo.week_of_prediction,
      finalGradePrediction: repo.final_grade_prediction,
      csvFileUrl: repo.csv_file_url,
    }));
  } catch (error) {
    console.error("Error in getRepositories:", error);
    toast.error("Failed to load repositories");
    return [];
  }
};

export const getRepositoryStudents = async (repositoryId: string) => {
  const { data, error } = await supabase
    .from("repositories")
    .select("students")
    .eq("id", repositoryId)
    .single();

  if (error || !data) return [];
  
  return parseStudents(data.students);
};
