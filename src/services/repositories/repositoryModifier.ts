
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Repository } from "../types/repositoryTypes";
import { Student } from "../studentData";

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
    };

    const { data: insertedRepo, error } = await supabase
      .from("repositories")
      .insert([repoForInsert])
      .select()
      .single();
    
    if (error) {
      console.error("Error inserting repository:", error);
      toast.error("Failed to add repository to Supabase");
      throw error;
    }
    
    // If there are students to add, insert them in the students table
    if (repository.students && Array.isArray(repository.students) && repository.students.length > 0) {
      const studentsToInsert = repository.students.map((student: Student) => ({
        repository_id: insertedRepo.id,
        name: student.name,
        email: student.email,
        gitlab_username: student.gitlabUsername,
        gitlab_member_id: student.gitlabMemberId,
      }));
      
      const { error: studentError } = await supabase
        .from("students")
        .insert(studentsToInsert);
      
      if (studentError) {
        console.error("Error inserting students:", studentError);
        // We'll continue even if there's an error with students
      }
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
  };

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
  const repository: Repository = {
    id: data.id,
    name: data.name,
    description: "", // Default value
    lastActivity: data.created_at || new Date().toISOString(),
    commitCount: 0,
    mergeRequestCount: 0,
    branchCount: 1,
    progress: 0,
    createdAt: data.created_at,
    link: data.link,
    projectId: data.project_id,
    userId: data.user_id,
    // Add default values for UI properties
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
    apiKey: "",
  };

  // If students were updated, handle them separately
  if (updatedRepo.students) {
    // Update students - for simplicity, we'll leave this implementation
    // until we're ready to properly implement the student management
  }

  return repository;
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
  try {
    const studentData = {
      repository_id: repositoryId,
      name: student.name,
      email: student.email,
      gitlab_username: student.gitlabUsername,
      gitlab_member_id: student.gitlabMemberId,
    };
    
    // Check if student exists
    const { data: existingStudents, error: findError } = await supabase
      .from("students")
      .select("*")
      .eq("id", student.id)
      .single();
    
    if (findError && findError.code !== "PGRST116") { // PGRST116 is "No rows found"
      console.error("Error finding student:", findError);
      toast.error("Failed to find student");
      return false;
    }
    
    if (existingStudents) {
      // Update existing student
      const { error: updateError } = await supabase
        .from("students")
        .update(studentData)
        .eq("id", student.id);
      
      if (updateError) {
        console.error("Error updating student:", updateError);
        toast.error("Failed to update student");
        return false;
      }
    } else {
      // Insert new student
      const { error: insertError } = await supabase
        .from("students")
        .insert([{ ...studentData, id: student.id }]);
      
      if (insertError) {
        console.error("Error inserting student:", insertError);
        toast.error("Failed to insert student");
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error in saveRepositoryStudent:", error);
    toast.error("Failed to save student");
    return false;
  }
};

export const clearAllRepositories = async (): Promise<void> => {
  // Not safe to bulk delete all remotely. Consider only for dev mode.
};
