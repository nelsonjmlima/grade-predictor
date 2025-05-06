
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Repository, RepositoryDB } from "../types/repositoryTypes";
import { Student } from "../studentData";
import { prepareStudentsForStorage } from "./dataHelpers";
import { parseStudents } from "./dataHelpers";

export const addRepository = async (repository: Repository): Promise<void> => {
  try {
    console.log("Adding repository to Supabase:", repository);
    
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    
    console.log("Current user ID:", userId);
    
    if (!userId) {
      toast.error("You must be logged in to add a repository");
      throw new Error("User not authenticated");
    }
    
    // Only include fields that exist in the database schema
    const repoForInsert = {
      name: repository.name,
      project_id: repository.projectId || repository.id || "",
      link: repository.link || "",
      user_id: userId,
      created_at: repository.createdAt || new Date().toISOString(),
      // The following fields might not be in the base schema but may have been added via SQL
      description: repository.description || "",
      api_key: repository.apiKey || "",
      students: prepareStudentsForStorage(repository.students),
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
  // Only include fields that exist in the database schema
  const repoForUpdate: any = {
    name: updatedRepo.name,
    link: updatedRepo.link,
    project_id: updatedRepo.projectId,
    // The following fields might not be in the base schema but may have been added via SQL
    description: updatedRepo.description,
    api_key: updatedRepo.apiKey,
  };

  // Only add students field if it's defined in the update
  if (updatedRepo.students !== undefined) {
    repoForUpdate.students = prepareStudentsForStorage(updatedRepo.students);
  }

  // Remove undefined fields to avoid sending null values
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
  
  // Convert DB format to Repository format
  return {
    id: data.id,
    name: data.name,
    description: data.description || "",
    lastActivity: data.created_at || new Date().toISOString(),
    commitCount: 0,
    mergeRequestCount: 0,
    branchCount: 1,
    progress: 0,
    createdAt: data.created_at,
    link: data.link,
    students: parseStudents(data.students || null),
    projectId: data.project_id,
    userId: data.user_id,
    // Add default values for UI properties
    apiKey: data.api_key,
    author: "",
    email: "",
    date: data.created_at,
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
    .select("*")
    .eq("id", repositoryId)
    .single();

  if (error) {
    console.error("Error loading repository for saving student:", error);
    toast.error("Failed to load repository for saving student");
    return false;
  }

  const students = parseStudents(data.students || null) as Student[];
  
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
