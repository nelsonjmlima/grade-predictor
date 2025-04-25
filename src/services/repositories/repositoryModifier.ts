
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Repository } from "../types/repositoryTypes";
import { Student } from "../studentData";
import { prepareStudentsForStorage } from "./dataHelpers";
import { parseStudents } from "./dataHelpers";

export const addRepository = async (repository: Repository): Promise<void> => {
  try {
    console.log("Adding repository to Supabase:", repository);
    
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    
    console.log("Current user ID:", userId);
    
    const repoForInsert = {
      name: repository.name,
      description: repository.description,
      last_activity: repository.lastActivity,
      commit_count: repository.commitCount,
      merge_request_count: repository.mergeRequestCount,
      branch_count: repository.branchCount,
      progress: repository.progress,
      predicted_grade: repository.predictedGrade,
      project_id: repository.projectId || repository.id,
      author: repository.author,
      email: repository.email,
      date: repository.date,
      additions: repository.additions,
      deletions: repository.deletions,
      operations: repository.operations,
      total_additions: repository.totalAdditions,
      total_deletions: repository.totalDeletions,
      total_operations: repository.totalOperations,
      average_operations_per_commit: repository.averageOperationsPerCommit,
      average_commits_per_week: repository.averageCommitsPerWeek,
      link: repository.link,
      api_key: repository.apiKey,
      user_id: userId || repository.userId,
      gitlab_user: repository.gitlabUser,
      week_of_prediction: repository.weekOfPrediction,
      final_grade_prediction: repository.finalGradePrediction,
      created_at: repository.createdAt || new Date().toISOString(),
      language: repository.language,
      technologies: repository.technologies,
      students: prepareStudentsForStorage(repository.students),
      csv_file_url: repository.csvFileUrl
    };

    const { error } = await supabase.from("repositories").insert([repoForInsert]);
    
    if (error) {
      console.error("Error inserting repository:", error);
      toast.error("Failed to add repository to Supabase");
      throw error;
    }
    
    console.log("Repository added successfully to Supabase");
    toast.success("Repository added to Supabase");
  } catch (error) {
    console.error("Error in addRepository:", error);
    toast.error("Failed to add repository");
    throw error;
  }
};

export const updateRepository = async (id: string, updatedRepo: Partial<Repository>): Promise<Repository | null> => {
  const repoForUpdate: any = {
    name: updatedRepo.name,
    description: updatedRepo.description,
    last_activity: updatedRepo.lastActivity,
    commit_count: updatedRepo.commitCount,
    merge_request_count: updatedRepo.mergeRequestCount,
    branch_count: updatedRepo.branchCount,
    progress: updatedRepo.progress,
    predicted_grade: updatedRepo.predictedGrade,
    project_id: updatedRepo.projectId,
    author: updatedRepo.author,
    email: updatedRepo.email,
    date: updatedRepo.date,
    additions: updatedRepo.additions,
    deletions: updatedRepo.deletions,
    operations: updatedRepo.operations,
    total_additions: updatedRepo.totalAdditions,
    total_deletions: updatedRepo.totalDeletions,
    total_operations: updatedRepo.totalOperations,
    average_operations_per_commit: updatedRepo.averageOperationsPerCommit,
    average_commits_per_week: updatedRepo.averageCommitsPerWeek,
    link: updatedRepo.link,
    api_key: updatedRepo.apiKey,
    user_id: updatedRepo.userId,
    gitlab_user: updatedRepo.gitlabUser,
    week_of_prediction: updatedRepo.weekOfPrediction,
    final_grade_prediction: updatedRepo.finalGradePrediction,
    language: updatedRepo.language,
    technologies: updatedRepo.technologies,
    csv_file_url: updatedRepo.csvFileUrl
  };

  if (updatedRepo.students !== undefined) {
    repoForUpdate.students = prepareStudentsForStorage(updatedRepo.students);
  }

  Object.keys(repoForUpdate).forEach(key => {
    if (repoForUpdate[key] === undefined) {
      delete repoForUpdate[key];
    }
  });

  const { data, error } = await supabase
    .from("repositories")
    .update(repoForUpdate)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating repository:", error);
    return null;
  }

  if (!data) return null;
  
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    lastActivity: data.last_activity,
    commitCount: data.commit_count,
    mergeRequestCount: data.merge_request_count,
    branchCount: data.branch_count,
    progress: data.progress,
    predictedGrade: data.predicted_grade,
    createdAt: data.created_at,
    link: data.link,
    students: parseStudents(data.students),
    projectId: data.project_id,
    author: data.author,
    email: data.email,
    date: data.date,
    additions: data.additions,
    deletions: data.deletions,
    operations: data.operations,
    totalAdditions: data.total_additions,
    totalDeletions: data.total_deletions,
    totalOperations: data.total_operations,
    averageOperationsPerCommit: data.average_operations_per_commit,
    averageCommitsPerWeek: data.average_commits_per_week,
    language: data.language,
    technologies: data.technologies,
    userId: data.user_id,
    gitlabUser: data.gitlab_user,
    weekOfPrediction: data.week_of_prediction,
    finalGradePrediction: data.final_grade_prediction,
    csvFileUrl: data.csv_file_url,
  };
};

export const deleteRepository = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from("repositories").delete().eq("id", id);
  if (error) {
    console.error("Error deleting repository:", error);
    toast.error("Failed to delete repository");
    return false;
  }
  return true;
};

export const saveRepositoryStudent = async (
  repositoryId: string,
  student: Student
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("repositories")
    .select("students")
    .eq("id", repositoryId)
    .single();

  if (error) {
    console.error("Error loading repository for saving student:", error);
    toast.error("Failed to load repository for saving student");
    return false;
  }

  const students = parseStudents(data.students) as Student[];
  
  const idx = students.findIndex((s) => s.id === student.id);
  if (idx >= 0) {
    students[idx] = student;
  } else {
    students.push(student);
  }

  const { error: updateError } = await supabase
    .from("repositories")
    .update({ students: prepareStudentsForStorage(students) })
    .eq("id", repositoryId);

  if (updateError) {
    console.error("Error updating students in repository:", updateError);
    toast.error("Failed to update students in repository");
    return false;
  }
  return true;
};

export const clearAllRepositories = async (): Promise<void> => {
  // Not safe to bulk delete all remotely. Consider only for dev mode.
};
