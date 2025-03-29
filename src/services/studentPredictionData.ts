
// Sample data generator for student grade prediction model

// Generate prediction accuracy data
const generateAccuracyData = () => {
  const accuracyData = [];
  const periods = ['2023 Q1', '2023 Q2', '2023 Q3', '2023 Q4', '2024 Q1', '2024 Q2'];
  
  for (let i = 0; i < periods.length; i++) {
    const accuracy = 70 + Math.floor(Math.random() * 20);
    const error = Math.floor(Math.random() * 15) + 5;
    
    accuracyData.push({
      period: periods[i],
      accuracy,
      error
    });
  }
  
  return accuracyData;
};

// Generate comparison data between student and peers
const generateComparisonData = () => {
  const categories = [
    'Commit Frequency', 
    'Code Quality', 
    'Task Completion', 
    'Collaboration', 
    'Project Complexity'
  ];
  
  return categories.map(category => {
    const studentScore = 50 + Math.floor(Math.random() * 40);
    const averageScore = 40 + Math.floor(Math.random() * 30);
    const topScore = Math.min(95, studentScore + 5 + Math.floor(Math.random() * 20));
    
    return {
      category,
      studentScore,
      averageScore,
      topScore
    };
  });
};

// Generate sample student prediction data
export const generatePredictionData = (repoId: string, studentId: string) => {
  // Calculate score between 0-100
  const score = 60 + Math.floor(Math.random() * 35);
  
  // Map score to letter grade
  let letter = '';
  if (score >= 90) letter = 'A';
  else if (score >= 80) letter = 'B';
  else if (score >= 70) letter = 'C';
  else if (score >= 60) letter = 'D';
  else letter = 'F';
  
  // Get student and repository names based on IDs
  const studentName = getStudentName(studentId);
  const repositoryName = getRepositoryName(repoId);
  
  // Generate prediction factors
  const factors = [
    {
      name: 'Commit Activity',
      description: 'Based on frequency, consistency, and quality of commits',
      rawValue: 42,
      maxValue: 50,
      normalizedScore: 0.84,
      weight: 0.35,
      icon: 'git-commit',
      metrics: [
        { name: 'Total Commits', value: 42, icon: 'git-commit' },
        { name: 'Commit Frequency', value: '4.7 / week', icon: 'clock' },
        { name: 'Lines Changed', value: '2,384', icon: 'file-code' }
      ]
    },
    {
      name: 'Code Quality',
      description: 'Based on code style, documentation, and test coverage',
      rawValue: 76,
      maxValue: 100,
      normalizedScore: 0.76,
      weight: 0.25,
      icon: 'file-code',
      metrics: [
        { name: 'Style Compliance', value: '82%', icon: 'file-check' },
        { name: 'Documentation', value: '68%', icon: 'file-code' },
        { name: 'Test Coverage', value: '74%', icon: 'code' }
      ]
    },
    {
      name: 'Task Completion',
      description: 'Based on assigned tasks, project milestones, and deadlines',
      rawValue: 12,
      maxValue: 15,
      normalizedScore: 0.8,
      weight: 0.2,
      icon: 'clock',
      metrics: [
        { name: 'Tasks Completed', value: '12/15', icon: 'file-check' },
        { name: 'On-time Completion', value: '87%', icon: 'clock' },
        { name: 'Issue Resolution', value: '93%', icon: 'code' }
      ]
    },
    {
      name: 'Collaboration',
      description: 'Based on team interactions, code reviews, and merge requests',
      rawValue: 15,
      maxValue: 25,
      normalizedScore: 0.6,
      weight: 0.2,
      icon: 'users',
      metrics: [
        { name: 'Code Reviews', value: 8, icon: 'file-check' },
        { name: 'Merge Requests', value: 15, icon: 'git-branch' },
        { name: 'Comments', value: 47, icon: 'users' }
      ]
    }
  ];
  
  // Generate prediction summary points
  const summary = [
    `Strong commit activity with ${factors[0].rawValue} commits, indicating consistent engagement.`,
    `Code quality is above average at ${factors[1].normalizedScore * 100}%, with good style compliance.`,
    `Completed ${factors[2].rawValue} out of ${factors[2].maxValue} assigned tasks with good timeliness.`,
    `${factors[3].normalizedScore < 0.7 ? 'Could improve on collaboration' : 'Good collaboration'} with ${factors[3].metrics[0].value} code reviews and ${factors[3].metrics[1].value} merge requests.`,
    `Overall prediction confidence is high based on consistent patterns across all metrics.`
  ];
  
  return {
    studentId,
    studentName,
    repositoryId: repoId,
    repositoryName,
    predictedGrade: {
      letter,
      score
    },
    confidenceLevel: 70 + Math.floor(Math.random() * 20),
    factors,
    summary,
    accuracyData: generateAccuracyData(),
    comparisonData: generateComparisonData()
  };
};

// Helper functions to get names from IDs
function getStudentName(studentId: string): string {
  const studentNames: Record<string, string> = {
    "s1": "Alex Johnson",
    "s2": "Jamie Smith",
    "s3": "Sam Wilson",
    "s4": "Taylor Brown",
    "s5": "Jordan Lee",
    "s6": "Morgan Williams",
    "s7": "Casey Martin",
    "s8": "Riley Thompson",
  };
  
  return studentNames[studentId] || `Student ${studentId}`;
}

function getRepositoryName(repoId: string): string {
  const repoNames: Record<string, string> = {
    "programming-fundamentals": "Programming Fundamentals 2023",
    "advanced-programming": "Advanced Programming Course",
    "data-structures": "Data Structures and Algorithms",
    "web-development": "Web Development Techniques"
  };
  
  return repoNames[repoId] || `Repository ${repoId}`;
}
