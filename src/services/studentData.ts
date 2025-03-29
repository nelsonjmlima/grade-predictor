
// Type definitions for student data
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

// Sample student data for demonstration purposes
const sampleStudentData: StudentData = {
  id: "s12345",
  name: "John Doe",
  email: "john.doe@university.edu",
  commitCount: 136,
  commitTrend: "up",
  commitPercentChange: 12,
  currentGrade: "B+",
  activityScore: 8.7,
  studentNumber: "123456",
  gitlabUsername: "johndoe",
  groupNumber: 1,
  
  // Data for charts
  commits: [
    { date: "Jan", count: 12 },
    { date: "Feb", count: 15 },
    { date: "Mar", count: 8 },
    { date: "Apr", count: 21 },
    { date: "May", count: 18 },
    { date: "Jun", count: 25 },
    { date: "Jul", count: 16 },
    { date: "Aug", count: 22 }
  ],
  
  fileChanges: [
    { type: "JavaScript", count: 45, color: "#f7df1e" },
    { type: "HTML", count: 22, color: "#e34c26" },
    { type: "CSS", count: 18, color: "#563d7c" },
    { type: "Documentation", count: 15, color: "#83B81A" }
  ],
  
  codeQuality: [
    { category: "Code Structure", score: 8.5, maxScore: 10 },
    { category: "Documentation", score: 7, maxScore: 10 },
    { category: "Testing", score: 6.5, maxScore: 10 },
    { category: "Best Practices", score: 9, maxScore: 10 }
  ],
  
  codeReviews: [
    {
      title: "Feature: User Authentication",
      type: "positive",
      message: "Well-structured code with good separation of concerns.",
      reviewer: "Prof. Smith",
      date: "Jun 12, 2023"
    },
    {
      title: "Task: Database Integration",
      type: "improvement",
      message: "Could use more error handling, but overall approach is sound.",
      reviewer: "Prof. Johnson",
      date: "May 28, 2023"
    },
    {
      title: "Bug Fix: Login Form",
      type: "negative",
      message: "Security issue with password handling. Please revise.",
      reviewer: "Prof. Smith",
      date: "Apr 15, 2023"
    }
  ],
  
  // Contribution timeline (last 4 weeks)
  contributions: Array.from({ length: 28 }, (_, i) => {
    // Generate random count with more recent dates having slightly higher values
    const recencyBoost = Math.floor(i / 7) * 0.5;
    const randomCount = Math.max(0, Math.floor(Math.random() * 6 - recencyBoost));
    
    // Calculate date (going backwards from today)
    const date = new Date();
    date.setDate(date.getDate() - (28 - i));
    
    return {
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      count: randomCount
    };
  })
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

// Initialize data on module load
loadCustomStudentData();

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
