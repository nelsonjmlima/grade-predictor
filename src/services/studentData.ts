
// Mock student data for demonstration purposes
const sampleStudentData = {
  id: "s12345",
  name: "John Doe",
  email: "john.doe@university.edu",
  commitCount: 136,
  commitTrend: "up",
  commitPercentChange: 12,
  currentGrade: "B+",
  activityScore: 8.7,
  
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

// Simulates fetching student data
export const getStudentData = async (studentId?: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sampleStudentData);
    }, 1000);
  });
};
