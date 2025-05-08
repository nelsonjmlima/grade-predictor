
import { Json } from "@/integrations/supabase/types";

// Define types for students
export interface Student {
  id: string;
  name: string;
  email: string;
  commitCount?: number;
  commitTrend?: "up" | "down" | "stable";
  commitPercentChange?: number;
  currentGrade?: string;
  activityScore?: number;
  studentNumber?: string;
  gitlabUsername?: string;
  gitlabMemberId?: number;
  groupNumber?: number;
  lastActivity?: string;
  grade?: string;
  commits?: { date: string; count: number }[];
  fileChanges?: { type: string; count: number; color: string }[];
  codeQuality?: { category: string; score: number; maxScore: number }[];
  codeReviews?: {
    title: string;
    type: "positive" | "negative" | "improvement";
    message: string;
    reviewer: string;
    date: string;
  }[];
  contributions?: { date: string; count: number }[];
  projectId?: string;
  additions?: number;
  deletions?: number;
  averageOperationsPerCommit?: number;
  averageCommitsPerWeek?: number;
  activityTrend?: "up" | "down" | "stable";
  repositoryId?: string;
}

// This interface represents the complete repository with all client-side fields
export interface Repository {
  id?: string;
  name: string;
  description?: string;
  lastActivity?: string;
  commitCount?: number;
  mergeRequestCount?: number;
  branchCount?: number;
  progress?: number;
  predictedGrade?: string;
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
}

// Define types for groups
export interface Group {
  id: string;
  name: string;
  repositoryId: string;
  createdAt: string;
  studentCount?: number;
}

export const sampleStudents: Student[] = [];
export const programmingStudents: Student[] = [];
export const allRepositories: Repository[] = [];
