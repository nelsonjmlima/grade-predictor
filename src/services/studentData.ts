
// Type definitions for student data
export interface Student {
  id: string;
  name: string;
  email: string;
  commitCount: number;
  commitTrend?: "up" | "down" | "stable";
  commitPercentChange?: number;
  currentGrade?: string;
  activityScore?: number;
  studentNumber?: string;
  gitlabUsername?: string;
  groupNumber?: number;
  lastActivity: string;
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
}

// Type definitions for student data details
export interface StudentData {
  id: string;
  name: string;
  email: string;
  commitCount: number;
  commitTrend: "up" | "down" | "stable";
  commitPercentChange: number;
  currentGrade: string;
  activityScore: number;
  studentNumber?: string;
  gitlabUsername?: string;
  groupNumber?: number;
  commits: { date: string; count: number }[];
  fileChanges: { type: string; count: number; color: string }[];
  codeQuality: { category: string; score: number; maxScore: number }[];
  codeReviews: {
    title: string;
    type: "positive" | "negative" | "improvement";
    message: string;
    reviewer: string;
    date: string;
  }[];
  contributions: { date: string; count: number }[];
}

// Empty sample student data
const sampleStudentData: StudentData = {
  id: "",
  name: "",
  email: "",
  commitCount: 0,
  commitTrend: "stable",
  commitPercentChange: 0,
  currentGrade: "",
  activityScore: 0,
  commits: [],
  fileChanges: [],
  codeQuality: [],
  codeReviews: [],
  contributions: []
};

// Store for custom student data
let customStudentData: Record<string, StudentData> = {};

// Load custom student data from localStorage if available
const loadCustomStudentData = (): void => {
  const storedData = localStorage.getItem('customStudentData');
  if (storedData) {
    try {
      customStudentData = JSON.parse(storedData);
    } catch (error) {
      console.error('Error loading student data from localStorage:', error);
    }
  }
};

// Save custom student data to localStorage
const persistCustomStudentData = (): void => {
  localStorage.setItem('customStudentData', JSON.stringify(customStudentData));
};

// Clear all student data
const clearAllStudentData = (): void => {
  customStudentData = {};
  localStorage.removeItem('customStudentData');
  localStorage.setItem('customStudentData', JSON.stringify({}));
};

// Initialize data on module load
clearAllStudentData();

// Simulates fetching student data
export const getStudentData = async (studentId?: string): Promise<StudentData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (studentId && customStudentData[studentId]) {
        resolve(customStudentData[studentId]);
      } else {
        resolve(sampleStudentData);
      }
    }, 1000);
  });
};

// Add or update a student
export const saveStudentData = async (studentData: Partial<StudentData> & { id: string }): Promise<StudentData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // If this student exists, update it; otherwise create a new one based on the sample
      const existingData = customStudentData[studentData.id] || { ...sampleStudentData, id: studentData.id };
      
      // Merge the data, keeping chart data from the existing record if not provided
      const updatedData: StudentData = {
        ...existingData,
        ...studentData,
        // Make sure we don't lose chart data if it wasn't provided
        commits: studentData.commits || existingData.commits,
        fileChanges: studentData.fileChanges || existingData.fileChanges,
        codeQuality: studentData.codeQuality || existingData.codeQuality,
        codeReviews: studentData.codeReviews || existingData.codeReviews,
        contributions: studentData.contributions || existingData.contributions
      };
      
      // Store the updated data
      customStudentData[studentData.id] = updatedData;
      
      // Persist to localStorage
      persistCustomStudentData();
      
      resolve(updatedData);
    }, 1000);
  });
};
