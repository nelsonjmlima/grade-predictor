
// Sample prediction data for demonstration
const samplePredictionData = {
  student: {
    id: "s12345",
    name: "John Doe",
    email: "john.doe@example.com"
  },
  repository: {
    id: "programming-fundamentals",
    name: "Programming Fundamentals 2023"
  },
  prediction: {
    grade: "A-",
    confidence: 87,
    trend: "up" as const
  },
  metrics: {
    commitCount: 143,
    commitFrequency: 7.8,
    commitTrend: "up",
    commitPercentChange: 12,
    codeQuality: 8.5,
    pullRequestCount: 15,
    branchActivity: 6.2,
    fileChanges: 9.3,
    timeConsistency: 7.5
  },
  metricsImportance: [
    {
      name: "Commit Frequency",
      value: 85,
      description: "Regular commits indicate consistent work and engagement",
      icon: "commit" as const
    },
    {
      name: "Code Quality",
      value: 75,
      description: "Quality of code based on linting and code review feedback",
      icon: "code" as const
    },
    {
      name: "Pull Request Engagement",
      value: 65,
      description: "Number and quality of pull requests submitted",
      icon: "merge" as const
    },
    {
      name: "Time Distribution",
      value: 60,
      description: "Even distribution of work across the semester timeline",
      icon: "time" as const
    },
    {
      name: "File Modifications",
      value: 55,
      description: "Breadth and depth of file changes across the repository",
      icon: "file" as const
    },
    {
      name: "Branch Management",
      value: 40,
      description: "Proper use of feature branches and development workflow",
      icon: "branch" as const
    }
  ],
  modelAccuracy: {
    overall: 85,
    byGrade: [
      { grade: "A", actual: 15, predicted: 14 },
      { grade: "B", actual: 27, predicted: 30 },
      { grade: "C", actual: 22, predicted: 19 },
      { grade: "D", actual: 10, predicted: 12 },
      { grade: "F", actual: 5, predicted: 4 }
    ],
    confusionMatrix: [
      [14, 1, 0, 0, 0],
      [2, 22, 3, 0, 0],
      [0, 4, 15, 3, 0],
      [0, 0, 2, 8, 0],
      [0, 0, 1, 1, 3]
    ],
    gradeLabels: ["A", "B", "C", "D", "F"]
  },
  predictionHistory: [
    {
      date: "Apr 15, 2023",
      grade: "B+",
      confidence: 72,
      change: 0
    },
    {
      date: "May 1, 2023",
      grade: "B+",
      confidence: 78,
      change: 6
    },
    {
      date: "May 15, 2023",
      grade: "A-",
      confidence: 81,
      change: 3
    },
    {
      date: "Jun 1, 2023",
      grade: "A-",
      confidence: 87,
      change: 6
    }
  ]
};

// Simulating API call with a delay
export const getPredictionData = async (studentId?: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(samplePredictionData);
    }, 1500);
  });
};
