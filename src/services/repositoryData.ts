import { Student } from "./studentData";
import { supabase } from "@/integrations/supabase/client";

export interface Repository {
  name: string;
  description: string;
  lastActivity: string;
  commitCount: number;
  mergeRequestCount: number;
  branchCount: number;
  progress: number;
  predictedGrade?: string;
  id?: string;
  students?: Student[] | string;
  studentIds?: string[];
  contributorsCount?: number;
  issuesCount?: number;
  codeQuality?: number;
  testCoverage?: number;
  deploymentFrequency?: number;
  averageGrade?: string;
  createdAt?: string;
  language?: string;
  technologies?: string[];
  projectId?: string;
  author?: string;
  email?: string;
  date?: string;
  additions?: number;
  deletions?: number;
  operations?: number;
  totalAdditions?: number;
  totalDeletions?: number;
  totalOperations?: number;
  averageOperationsPerCommit?: number;
  averageCommitsPerWeek?: number;
  link?: string;
  apiKey?: string;
  userId?: string;
  gitlabUser?: string;
  weekOfPrediction?: string;
  finalGradePrediction?: string;
  csvFileUrl?: string;
}

// No longer needed
// const defaultRepositories: Repository[] = [];
// let inMemoryRepositories: Repository[] = [...defaultRepositories];

export const getRepositories = async (): Promise<Repository[]> => {
  const { data, error } = await supabase
    .from("repositories")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error loading repositories:", error);
    return [];
  }
  // Convert database rows to local objects:
  return (data || []).map(repo => ({
    ...repo,
    id: repo.id,
    name: repo.name,
    description: repo.description,
    lastActivity: repo.last_activity || repo.lastActivity,
    commitCount: repo.commit_count || 0,
    mergeRequestCount: repo.merge_request_count || 0,
    branchCount: repo.branch_count || 1,
    progress: repo.progress || 0,
    createdAt: repo.created_at,
    link: repo.link,
    students: Array.isArray(repo.students) || typeof repo.students === "string" ? repo.students : undefined,
    // Other fields as needed...
  }));
};

export const addRepository = async (repository: Repository): Promise<void> => {
  // Prepare fields for inserting (remove undefined to avoid Supabase errors):
  const repoForInsert = {
    ...repository,
    id: repository.id,
    project_id: repository.projectId || repository.id,
    last_activity: repository.lastActivity,
    commit_count: repository.commitCount,
    merge_request_count: repository.mergeRequestCount,
    branch_count: repository.branchCount,
    predicted_grade: repository.predictedGrade,
    created_at: repository.createdAt || new Date().toISOString(),
    // Make sure students is a value serializable to JSON
    students:
      Array.isArray(repository.students) ? repository.students : [],
    week_of_prediction: repository.weekOfPrediction,
    final_grade_prediction: repository.finalGradePrediction,
    // Map all other custom fields...
  };
  await supabase.from("repositories").insert([repoForInsert]);
};

export const updateRepository = async (id: string, updatedRepo: Partial<Repository>): Promise<Repository | null> => {
  const { data, error } = await supabase
    .from("repositories")
    .update({
      ...updatedRepo,
      last_activity: updatedRepo.lastActivity,
      project_id: updatedRepo.projectId,
      predicted_grade: updatedRepo.predictedGrade,
      week_of_prediction: updatedRepo.weekOfPrediction,
      final_grade_prediction: updatedRepo.finalGradePrediction,
      students: Array.isArray(updatedRepo.students) ? updatedRepo.students : [],
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating repository:", error);
    return null;
  }
  return data ? { ...(data as Repository) } : null;
};

export const deleteRepository = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from("repositories").delete().eq("id", id);
  if (error) {
    console.error("Error deleting repository:", error);
    return false;
  }
  return true;
};

export const getRepositoryStudents = async (repositoryId: string): Promise<Student[]> => {
  const { data, error } = await supabase
    .from("repositories")
    .select("students")
    .eq("id", repositoryId)
    .single();

  if (error || !data) return [];
  const students = data.students;
  if (Array.isArray(students)) {
    return students;
  }
  return [];
};

export const saveRepositoryStudent = async (
  repositoryId: string,
  student: Student
): Promise<boolean> => {
  // Get current students
  const { data, error } = await supabase
    .from("repositories")
    .select("students")
    .eq("id", repositoryId)
    .single();

  if (error) {
    console.error("Error loading repository for saving student:", error);
    return false;
  }

  const students: Student[] = Array.isArray(data.students) ? data.students : [];
  const idx = students.findIndex((s) => s.id === student.id);
  if (idx >= 0) {
    students[idx] = student;
  } else {
    students.push(student);
  }

  const { error: updateError } = await supabase
    .from("repositories")
    .update({ students })
    .eq("id", repositoryId);

  if (updateError) {
    console.error("Error updating students in repository:", updateError);
    return false;
  }
  return true;
};


/**
 * In-memory sample students for legacy compatibility
 */
export const sampleStudents: Student[] = [];
export const programmingStudents: Student[] = [];

export const filterRepositories = (repositories: Repository[], searchTerm: string): Repository[] => {
  if (!searchTerm) {
    return repositories;
  }
  const lowerSearchTerm = searchTerm.toLowerCase();
  return repositories.filter(repo =>
    (repo.name?.toLowerCase().includes(lowerSearchTerm) || false) ||
    (repo.description?.toLowerCase().includes(lowerSearchTerm) || false) ||
    (repo.projectId?.toLowerCase().includes(lowerSearchTerm) || false) ||
    (repo.author?.toLowerCase().includes(lowerSearchTerm) || false) ||
    (repo.email?.toLowerCase().includes(lowerSearchTerm) || false)
  );
};

export const sortRepositories = (repositories: Repository[], sortBy: string): Repository[] => {
  switch (sortBy) {
    case 'recent':
      return repositories.sort((a, b) => {
        const aTime = new Date(a.date || a.lastActivity || "");
        const bTime = new Date(b.date || b.lastActivity || "");
        return bTime.getTime() - aTime.getTime();
      });
    case 'name':
      return repositories.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    case 'progress':
      return repositories.sort((a, b) => (b.progress || 0) - (a.progress || 0));
    case 'operations':
      return repositories.sort((a, b) => {
        const aOperations = a.totalOperations || a.operations || (a.additions && a.deletions ? a.additions + a.deletions : a.commitCount || 0);
        const bOperations = b.totalOperations || b.operations || (b.additions && b.deletions ? b.additions + b.deletions : b.commitCount || 0);
        return bOperations - aOperations;
      });
    case 'avgops':
      return repositories.sort((a, b) => (b.averageOperationsPerCommit || 0) - (a.averageOperationsPerCommit || 0));
    case 'avgcommits':
      return repositories.sort((a, b) => (b.averageCommitsPerWeek || 0) - (a.averageCommitsPerWeek || 0));
    default:
      return repositories;
  }
};

export const clearAllRepositories = async (): Promise<void> => {
  // Not safe to bulk delete all remotely. Consider only for dev mode.
  // await supabase.from("repositories").delete().neq('id', ''); // Or add other logic if needed
};

// Legacy direct reference, not used now:
export const allRepositories = [];
