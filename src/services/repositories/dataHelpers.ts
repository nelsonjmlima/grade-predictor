
import { Student } from "../studentData";
import { Json } from "@/integrations/supabase/types";

export const parseStudents = (studentsData: Json | null): Student[] | string => {
  if (!studentsData) return [];
  
  if (typeof studentsData === 'string') {
    return studentsData;
  }
  
  if (Array.isArray(studentsData)) {
    return studentsData.map(student => {
      if (typeof student !== 'object' || student === null) {
        return {
          id: 'unknown',
          name: 'Unknown Student',
          email: 'unknown@example.com',
          commitCount: 0,
          lastActivity: new Date().toISOString()
        };
      }
      
      const s = student as any;
      return {
        id: s.id || 'unknown',
        name: s.name || 'Unknown Student',
        email: s.email || 'unknown@example.com',
        commitCount: s.commitCount || s.commit_count || 0,
        lastActivity: s.lastActivity || s.last_activity || new Date().toISOString(),
        commitTrend: s.commitTrend || s.commit_trend,
        commitPercentChange: s.commitPercentChange || s.commit_percent_change,
        currentGrade: s.currentGrade || s.current_grade,
        activityScore: s.activityScore || s.activity_score,
        studentNumber: s.studentNumber || s.student_number,
        gitlabUsername: s.gitlabUsername || s.gitlab_username,
        groupNumber: s.groupNumber || s.group_number,
        grade: s.grade,
        commits: s.commits,
        fileChanges: s.fileChanges || s.file_changes,
        codeQuality: s.codeQuality || s.code_quality,
        codeReviews: s.codeReviews || s.code_reviews,
        contributions: s.contributions,
        projectId: s.projectId || s.project_id,
        additions: s.additions,
        deletions: s.deletions,
        averageOperationsPerCommit: s.averageOperationsPerCommit || s.average_operations_per_commit,
        averageCommitsPerWeek: s.averageCommitsPerWeek || s.average_commits_per_week,
        activityTrend: s.activityTrend || s.activity_trend,
      } as Student;
    });
  }
  
  return [];
};

export const prepareStudentsForStorage = (students: Student[] | string | undefined): Json => {
  if (!students) return [];
  if (typeof students === 'string') return students;
  
  return students.map(student => {
    return {
      id: student.id,
      name: student.name,
      email: student.email,
      commitCount: student.commitCount,
      lastActivity: student.lastActivity,
      commitTrend: student.commitTrend,
      commitPercentChange: student.commitPercentChange,
      currentGrade: student.currentGrade,
      activityScore: student.activityScore,
      studentNumber: student.studentNumber,
      gitlabUsername: student.gitlabUsername,
      groupNumber: student.groupNumber,
      grade: student.grade,
      commits: student.commits,
      fileChanges: student.fileChanges,
      codeQuality: student.codeQuality,
      codeReviews: student.codeReviews,
      contributions: student.contributions,
      projectId: student.projectId,
      additions: student.additions,
      deletions: student.deletions,
      averageOperationsPerCommit: student.averageOperationsPerCommit,
      averageCommitsPerWeek: student.averageCommitsPerWeek,
      activityTrend: student.activityTrend,
    };
  });
};
