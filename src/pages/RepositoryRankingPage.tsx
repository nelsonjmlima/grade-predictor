
import { useState, useEffect } from "react";
import { getRepositories, Repository } from "@/services/repositoryData";

export default function RepositoryRankingPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchRepositories();
  }, []);

  return (
    <div>
      <h1>Repository Rankings</h1>
      {loading ? (
        <p>Loading repositories...</p>
      ) : (
        <div>
          {repositories.length > 0 ? (
            <ul>
              {repositories.map((repo) => (
                <li key={repo.id}>{repo.name}</li>
              ))}
            </ul>
          ) : (
            <p>No repositories found.</p>
          )}
        </div>
      )}
    </div>
  );
}
