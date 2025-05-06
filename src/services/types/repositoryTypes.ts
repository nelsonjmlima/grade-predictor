
import { Student } from "../studentData";
import { Json } from "@/integrations/supabase/types";

// This interface represents the complete repository with all client-side fields
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

// This interface represents what's stored in the Supabase database
export interface RepositoryDB {
  id: string;
  user_id: string | null;
  created_at: string | null;
  project_id: string;
  name: string;
  link: string;
  // Fields added via SQL but not in the DB schema definition
  description?: string;
  students?: Json;
  api_key?: string;
  // Add any other fields that might be added via SQL but not in the schema definition
}

export const sampleStudents: Student[] = [];
export const programmingStudents: Student[] = [];
export const allRepositories: Repository[] = [];
