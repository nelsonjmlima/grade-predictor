
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Repository } from "../types/repositoryTypes";
import { Student } from "../types/repositoryTypes";

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

// Group management functions
export const addGroup = async (name: string, repositoryId: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from("groups")
      .insert({ 
        name,
        repository_id: repositoryId,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group");
      throw error;
    }
    
    toast.success("Group created successfully");
    return data;
  } catch (error) {
    console.error("Error in addGroup:", error);
    throw error;
  }
};

export const addStudentToGroup = async (groupId: string, studentId: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from("group_students")
      .insert({
        group_id: groupId,
        student_id: studentId
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error adding student to group:", error);
      toast.error("Failed to add student to group");
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in addStudentToGroup:", error);
    throw error;
  }
};

export const removeStudentFromGroup = async (groupId: string, studentId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("group_students")
      .delete()
      .eq("group_id", groupId)
      .eq("student_id", studentId);
      
    if (error) {
      console.error("Error removing student from group:", error);
      toast.error("Failed to remove student from group");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in removeStudentFromGroup:", error);
    return false;
  }
};

export const deleteGroup = async (groupId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("groups")
      .delete()
      .eq("id", groupId);
      
    if (error) {
      console.error("Error deleting group:", error);
      toast.error("Failed to delete group");
      return false;
    }
    
    toast.success("Group deleted successfully");
    return true;
  } catch (error) {
    console.error("Error in deleteGroup:", error);
    return false;
  }
};

export const clearAllRepositories = async (): Promise<void> => {
  // Not safe to bulk delete all remotely. Consider only for dev mode.
};
