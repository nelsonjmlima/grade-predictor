
import { Student } from "./studentData";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

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

export const getRepositories = async (): Promise<Repository[]> => {
  const { data, error } = await supabase
    .from("repositories")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error loading repositories:", error);
    return [];
  }
  
  // Convert database rows to local Repository objects with matching field names
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
    students: repo.students as Student[] | string,
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
};

export const addRepository = async (repository: Repository): Promise<void> => {
  // Map local Repository object to database field names
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
    user_id: repository.userId,
    gitlab_user: repository.gitlabUser,
    week_of_prediction: repository.weekOfPrediction,
    final_grade_prediction: repository.finalGradePrediction,
    created_at: repository.createdAt || new Date().toISOString(),
    language: repository.language,
    technologies: repository.technologies,
    students: repository.students ? JSON.parse(JSON.stringify(repository.students)) : [],
    csv_file_url: repository.csvFileUrl
  };

  await supabase.from("repositories").insert([repoForInsert]);
};

export const updateRepository = async (id: string, updatedRepo: Partial<Repository>): Promise<Repository | null> => {
  // Map local Repository object to database field names
  const repoForUpdate = {
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
    students: updatedRepo.students ? JSON.parse(JSON.stringify(updatedRepo.students)) : undefined,
    csv_file_url: updatedRepo.csvFileUrl
  };

  // Remove undefined properties to avoid setting null values
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
  
  // Map back to our Repository interface
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
    students: data.students as Student[] | string,
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
    return students as Student[];
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

  const students: Student[] = Array.isArray(data.students) ? data.students as Student[] : [];
  const idx = students.findIndex((s) => s.id === student.id);
  if (idx >= 0) {
    students[idx] = student;
  } else {
    students.push(student);
  }

  const { error: updateError } = await supabase
    .from("repositories")
    .update({ students: JSON.parse(JSON.stringify(students)) })
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
