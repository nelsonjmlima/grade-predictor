
// If the CreateRepositoryDialog is calling getRepositories directly,
// Update it to:
const refreshRepositories = async () => {
  try {
    await addRepository(newRepo as any);
    // No need to fetch repositories here as the parent component 
    // will refetch when the dialog closes
    toast.success("Repository created successfully", {
      description: `${repositoryData.projectName} has been created with ${selectedStudents.length} selected students.`,
    });
  } catch (error) {
    console.error("Error creating repository:", error);
    toast.error("Failed to create repository");
  }
};
