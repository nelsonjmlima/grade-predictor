
// Fix the setRepositories(getRepositories()) call
// Replace it with:
const fetchRepositories = async () => {
  try {
    setLoading(true);
    const repos = await getRepositories();
    setRepositories(repos);
  } catch (error) {
    console.error("Error fetching repositories:", error);
  } finally {
    setLoading(false);
  }
};
