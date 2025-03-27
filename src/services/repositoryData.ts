
// Sample repository data
export const allRepositories = [
  {
    name: "Programming Fundamentals 2023",
    description: "Course repository for first-year programming fundamentals",
    lastActivity: "Today at 10:15",
    commitCount: 215,
    mergeRequestCount: 32,
    branchCount: 8,
    progress: 78,
    predictedGrade: "B+",
    id: "programming-fundamentals"
  },
  {
    name: "Team Alpha Project",
    description: "Software Engineering final project for Team Alpha",
    lastActivity: "Today at 13:45",
    commitCount: 127,
    mergeRequestCount: 18,
    branchCount: 5,
    progress: 68,
    predictedGrade: "B+"
  },
  {
    name: "Web Development Course",
    description: "Web development course repository for CS301",
    lastActivity: "Yesterday at 09:22",
    commitCount: 84,
    mergeRequestCount: 12,
    branchCount: 3,
    progress: 75,
    predictedGrade: "A-"
  },
  {
    name: "Algorithm Analysis",
    description: "Team project for algorithm performance analysis",
    lastActivity: "3 days ago",
    commitCount: 56,
    mergeRequestCount: 7,
    branchCount: 2,
    progress: 42
  },
  {
    name: "Database Systems",
    description: "Group project for database implementation",
    lastActivity: "5 days ago",
    commitCount: 92,
    mergeRequestCount: 15,
    branchCount: 4,
    progress: 61,
    predictedGrade: "B"
  },
  {
    name: "Mobile App Development",
    description: "Final year mobile application project",
    lastActivity: "1 week ago",
    commitCount: 143,
    mergeRequestCount: 21,
    branchCount: 7,
    progress: 83,
    predictedGrade: "A"
  },
  {
    name: "Computer Networks",
    description: "Network simulation and analysis project",
    lastActivity: "2 weeks ago",
    commitCount: 48,
    mergeRequestCount: 5,
    branchCount: 2,
    progress: 35
  }
];

// Sample student data for the grades view template
export const sampleStudents = [
  { 
    id: "1", 
    name: "Emma Johnson", 
    email: "emma.j@university.edu", 
    commitCount: 34, 
    grade: "A", 
    lastActivity: "Today at 10:15" 
  },
  { 
    id: "2", 
    name: "Liam Smith", 
    email: "l.smith@university.edu", 
    commitCount: 27, 
    grade: "B+", 
    lastActivity: "Yesterday at 15:30" 
  },
  { 
    id: "3", 
    name: "Olivia Davis", 
    email: "o.davis@university.edu", 
    commitCount: 42, 
    grade: "A-", 
    lastActivity: "2 days ago" 
  },
  { 
    id: "4", 
    name: "Noah Wilson", 
    email: "n.wilson@university.edu", 
    commitCount: 18, 
    grade: "C+", 
    lastActivity: "3 days ago" 
  },
  { 
    id: "5", 
    name: "Sophia Martinez", 
    email: "s.martinez@university.edu", 
    commitCount: 31, 
    grade: undefined, 
    lastActivity: "5 days ago" 
  }
];

// New student data for Programming Fundamentals repository
export const programmingStudents = [
  { 
    id: "1", 
    name: "Ines Silva", 
    email: "ines.silva@university.edu", 
    commitCount: 45, 
    grade: "A-", 
    lastActivity: "Today at 09:30" 
  },
  { 
    id: "2", 
    name: "Carolina Pereira", 
    email: "carolina.p@university.edu", 
    commitCount: 38, 
    grade: "B+", 
    lastActivity: "Yesterday at 14:20" 
  },
  { 
    id: "3", 
    name: "Bruna Costa", 
    email: "bruna.c@university.edu", 
    commitCount: 52, 
    grade: "A", 
    lastActivity: "Today at 11:45" 
  },
  { 
    id: "4", 
    name: "Luis Santos", 
    email: "luis.s@university.edu", 
    commitCount: 31, 
    grade: "C+", 
    lastActivity: "3 days ago" 
  },
  { 
    id: "5", 
    name: "Nelson Oliveira", 
    email: "nelson.o@university.edu", 
    commitCount: 41, 
    grade: "B", 
    lastActivity: "Yesterday at 08:15" 
  }
];

// Helper functions for repositories
export const filterRepositories = (repositories: any[], searchTerm: string) => {
  return repositories.filter(repo => 
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    repo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const sortRepositories = (repositories: any[], sortBy: string) => {
  return [...repositories].sort((a, b) => {
    if (sortBy === 'recent') {
      // This is a simplified sort - in reality, you'd parse the dates
      return a.lastActivity > b.lastActivity ? -1 : 1;
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'progress') {
      return b.progress - a.progress;
    }
    return 0;
  });
};
